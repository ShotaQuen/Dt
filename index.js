const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const admin = require('firebase-admin');
const basicAuth = require('express-basic-auth');

const app = express();
const pricingJsonPath = path.join(__dirname, 'src', 'pricing.json');

const serviceAccount = require('./serviceAccountKey.json'); // ambil service account key json dari firebase console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nusantara-e4408-default-rtdb.firebaseio.com'
});

const db = admin.database();
const apiKeysRef = db.ref('apiKeys');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/src', express.static('src'));

const apiConfig = require('./src/ayano.json');

app.get('/src/pricing.json', (req, res) => {
    try {
        if (!fs.existsSync(pricingJsonPath)) {
            return res.status(404).json({ 
                status: false, 
                message: 'Pricing data not found' 
            });
        }

        const data = fs.readFileSync(pricingJsonPath, 'utf8');
        const pricingData = JSON.parse(data);
        
        res.json(pricingData);
    } catch (error) {
        console.error('Error loading pricing data:', error);
        res.status(500).json({ 
            status: false, 
            message: 'Failed to load pricing data' 
        });
    }
});

const loadScrapers = () => {
    const scrapers = {};
    const endpointConfigs = {};
    const baseDir = path.join(__dirname, 'api-setting', 'Scrape');
    
    const ayanoConfig = require('./src/ayano.json');
    const fullApiKeyMode = ayanoConfig.fullapikey;
    
    ayanoConfig.categories.forEach(category => {
        category.items.forEach(item => {
            const cleanPath = item.path.split('?')[0];
            
            let requireKey;
            if (fullApiKeyMode === "on") {
                requireKey = true;
            } else if (fullApiKeyMode === "off") {
                requireKey = false;
            } else if (fullApiKeyMode === "false") {
                requireKey = item.requireKey !== undefined ? item.requireKey : ayanoConfig.apiSettings.defaultRequireKey;
            } else {
                requireKey = item.requireKey !== undefined ? item.requireKey : ayanoConfig.apiSettings.defaultRequireKey;
            }
            
            endpointConfigs[cleanPath] = {
                requireKey: requireKey,
                path: item.path,
                params: item.params || null,
                allowedRoles: item.allowedRoles || null
            };
        });
    });

    const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath);
            } else if (file.endsWith('.js')) {
                const relativePath = path.relative(baseDir, fullPath);
                const routePath = '/' + relativePath
                    .replace(/\\/g, '/')
                    .replace('.js', '')
                    .toLowerCase();
                
                const config = endpointConfigs[routePath] || {
                    requireKey: ayanoConfig.apiSettings.defaultRequireKey,
                    params: null,
                    allowedRoles: null
                };
                
                scrapers[routePath] = {
                    handler: require(fullPath),
                    config: config
                };
            }
        });
    };
    
    walkDir(baseDir);
    return scrapers;
};

const scrapers = loadScrapers();

const checkApiKey = async (req, res, next) => {
    const path = req.path;
    const endpoint = scrapers[path];
    
    if (!endpoint) {
        return next();
    }

    const ayanoConfig = require('./src/ayano.json');
    const fullApiKeyMode = ayanoConfig.fullapikey;
    
    let requireKey;
    if (fullApiKeyMode === "on") {
        requireKey = true;
    } else if (fullApiKeyMode === "off") {
        requireKey = false;
    } else if (fullApiKeyMode === "false") {
        requireKey = endpoint.config.requireKey;
    } else {
        requireKey = endpoint.config.requireKey;
    }

    if (!requireKey) {
        return next();
    }
    
    const apiKey = req.headers['x-api-key'] || req.query.apikey;
    if (!apiKey) {
        return res.status(401).json({ 
            status: false, 
            message: 'API key diperlukan untuk endpoint ini' 
        });
    }
    
    try {
        const snapshot = await apiKeysRef.orderByChild('key').equalTo(apiKey).once('value');
        const keys = snapshot.val();
        
        if (!keys) {
            return res.status(403).json({ 
                status: false, 
                message: 'API key tidak valid' 
            });
        }
        
        const keyData = Object.values(keys)[0];
        const keyId = Object.keys(keys)[0];
        
        if (keyData.expiresAt && keyData.expiresAt < Date.now()) {
            return res.status(403).json({ 
                status: false, 
                message: 'API key telah kadaluarsa' 
            });
        }
        
        if (keyData.limit <= 0) {
            return res.status(403).json({ 
                status: false, 
                message: 'Limit API key telah habis' 
            });
        }
        
        if (endpoint.config.allowedRoles && keyData.role) {
            const allowedRoles = Array.isArray(endpoint.config.allowedRoles) 
                ? endpoint.config.allowedRoles 
                : [endpoint.config.allowedRoles];
            
            if (!allowedRoles.includes(keyData.role)) {
                return res.status(403).json({ 
                    status: false, 
                    message: 'Role API key tidak memiliki akses ke endpoint ini' 
                });
            }
        }
        
        await apiKeysRef.child(keyId).update({
            limit: keyData.limit - 1,
            lastUsed: Date.now()
        });
        
        next();
    } catch (error) {
        console.error('Error checking API key:', error);
        return res.status(500).json({ 
            status: false, 
            message: 'Terjadi kesalahan saat memverifikasi API key' 
        });
    }
};

app.get('/api/functions', (req, res) => {
    try {
        const functionsList = {};
        
        apiConfig.categories.forEach(category => {
            const categoryKey = category.name.toLowerCase().replace(/\s+/g, '');
            functionsList[categoryKey] = [];
            
            category.items.forEach(item => {
                const pathParts = item.path.split('/');
                let functionName = pathParts[pathParts.length - 1].split('?')[0];
                
                functionName = functionName
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .toLowerCase();
                
                const params = item.params ? Object.entries(item.params).map(([param, desc]) => ({
                    name: param,
                    description: desc
                })) : [];
                
                functionsList[categoryKey].push({
                    name: functionName,
                    description: item.desc,
                    path: item.path,
                    requireKey: item.requireKey !== undefined ? item.requireKey : apiConfig.apiSettings.defaultRequireKey,
                    allowedRoles: item.allowedRoles || null,
                    parameters: params
                });
            });
        });

        res.json({
            status: true,
            apiName: apiConfig.name,
            version: apiConfig.version,
            functions: functionsList
        });
    } catch (error) {
        console.error('Error generating functions list:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to generate functions list'
        });
    }
});

app.get('/admin/api-keys', basicAuth({
    users: { 'yayaya': 'apalo' },
    challenge: true,
    realm: 'Admin Area'
}), async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/admin/api-keys/list', basicAuth({
    users: { 'yayaya': 'apalo' },
    challenge: true
}), async (req, res) => {
    try {
        const snapshot = await apiKeysRef.once('value');
        const keys = snapshot.val();
        res.json({ success: true, keys });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/admin/api-keys', basicAuth({
    users: { 'yayaya': 'apalo' },
    challenge: true
}), express.json(), async (req, res) => {
    try {
        const { name, customKey, limit, expiresAt, role } = req.body;
        
        if (!name || !limit) {
            return res.status(400).json({ success: false, error: 'Nama dan limit diperlukan' });
        }
        
        const newKey = customKey || generateApiKey();
        
        const keyData = {
            name,
            key: newKey,
            limit: parseInt(limit),
            createdAt: Date.now(),
            lastUsed: null,
            expiresAt: expiresAt ? new Date(expiresAt).getTime() : null,
            role: role || null
        };
        
        await apiKeysRef.push().set(keyData);
        
        res.json({ success: true, key: newKey });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/admin/api-keys/:id', basicAuth({
    users: { 'yayaya': 'apalo' },
    challenge: true
}), express.json(), async (req, res) => {
    try {
        const { name, limit, expiresAt, role } = req.body;
        
        if (!name && !limit && !expiresAt && !role) {
            return res.status(400).json({ success: false, error: 'Data yang akan diupdate diperlukan' });
        }
        
        const updates = {};
        if (name) updates.name = name;
        if (limit) updates.limit = parseInt(limit);
        if (expiresAt) updates.expiresAt = new Date(expiresAt).getTime();
        if (role !== undefined) updates.role = role;
        
        await apiKeysRef.child(req.params.id).update(updates);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/admin/api-keys/:id', basicAuth({
    users: { 'yayaya': 'apalo' },
    challenge: true
}), async (req, res) => {
    try {
        await apiKeysRef.child(req.params.id).remove();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/stats', (req, res) => {
    try {
        let totalEndpoints = 0;
        let endpointsByCategory = {};
        
        apiConfig.categories.forEach(category => {
            const count = category.items.length;
            endpointsByCategory[category.name] = count;
            totalEndpoints += count;
        });

        res.json({
            status: true,
            data: {
                totalEndpoints: totalEndpoints,
                endpointsByCategory: endpointsByCategory,
                details: {
                    apiName: apiConfig.name,
                    version: apiConfig.version,
                    description: apiConfig.description,
                    creator: apiConfig.apiSettings.creator,
                    defaultRequireKey: apiConfig.apiSettings.defaultRequireKey,
                    lastUpdated: new Date().toISOString()
                }
            }
        });
    } catch (error) {
        console.error('Error calculating stats:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to calculate API statistics'
        });
    }
});

app.get('/api/endpoints', (req, res) => {
    try {
        const allEndpoints = [];
        
        apiConfig.categories.forEach(category => {
            category.items.forEach(item => {
                const params = item.params ? Object.entries(item.params).map(([param, desc]) => ({
                    name: param,
                    description: desc
                })) : [];
                
                allEndpoints.push({
                    name: item.name,
                    path: item.path.split('?')[0],
                    fullPath: item.path,
                    category: category.name,
                    description: item.desc,
                    requireKey: item.requireKey !== undefined ? item.requireKey : apiConfig.apiSettings.defaultRequireKey,
                    allowedRoles: item.allowedRoles || null,
                    status: item.status || 'ready',
                    parameters: params
                });
            });
        });

        res.json({
            status: true,
            count: allEndpoints.length,
            endpoints: allEndpoints
        });
    } catch (error) {
        console.error('Error listing endpoints:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to list all endpoints'
        });
    }
});

Object.entries(scrapers).forEach(([route, { handler, config }]) => {
    app.get(route, checkApiKey, async (req, res) => {
        try {
            const params = Object.keys(req.query)
                .filter(key => key !== 'apikey')
                .map(key => req.query[key]);
            
            const result = await handler(...params);
            res.json({
                status: true,
                creator: apiConfig.apiSettings.creator,
                result
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    });

    if (config.path && config.path.includes('?')) {
        app.get(config.path.split('?')[0], checkApiKey, (req, res) => {
            const exampleParams = config.params ? Object.keys(config.params).map(param => `${param}=value`).join('&') : '';
            
            res.status(400).json({
                status: false,
                message: 'Parameter diperlukan',
                requiredParameters: config.params || null,
                example: `${req.protocol}://${req.get('host')}${config.path}${exampleParams}`
            });
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

function generateApiKey() {
    return 'ak_' + require('crypto').randomBytes(16).toString('hex');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log('Endpoint yang tersedia:');
    Object.entries(scrapers).forEach(([path, { config }]) => {
        console.log(`- ${path} (Require Key: ${config.requireKey ? 'Ya' : 'Tidak'})`);
    });
});

module.exports = app;
