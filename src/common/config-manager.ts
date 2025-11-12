import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Environment {
    storeHash: string;
    accessToken: string;
}

export interface Config {
    environments: {
        [key: string]: Environment;
    };
    defaultEnvironment?: string;
}

const CONFIG_DIR = path.join(os.homedir(), '.bc-cli');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Ensures the config directory exists
 */
function ensureConfigDir(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}

/**
 * Loads the configuration from the config file
 */
export function loadConfig(): Config {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading config file:', error);
    }

    return { environments: {} };
}

/**
 * Saves the configuration to the config file
 */
export function saveConfig(config: Config): void {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Adds or updates an environment
 */
export function addEnvironment(name: string, storeHash: string, accessToken: string): void {
    const config = loadConfig();
    config.environments[name] = { storeHash, accessToken };

    // If this is the first environment, set it as default
    if (!config.defaultEnvironment) {
        config.defaultEnvironment = name;
    }

    saveConfig(config);
}

/**
 * Removes an environment
 */
export function removeEnvironment(name: string): boolean {
    const config = loadConfig();

    if (!config.environments[name]) {
        return false;
    }

    delete config.environments[name];

    // If we removed the default environment, set a new default
    if (config.defaultEnvironment === name) {
        const remainingEnvs = Object.keys(config.environments);
        config.defaultEnvironment = remainingEnvs.length > 0 ? remainingEnvs[0] : undefined;
    }

    saveConfig(config);
    return true;
}

/**
 * Sets the default environment
 */
export function setDefaultEnvironment(name: string): boolean {
    const config = loadConfig();

    if (!config.environments[name]) {
        return false;
    }

    config.defaultEnvironment = name;
    saveConfig(config);
    return true;
}

/**
 * Gets the default environment credentials
 */
export function getDefaultEnvironment(): Environment | null {
    const config = loadConfig();

    if (config.defaultEnvironment && config.environments[config.defaultEnvironment]) {
        return config.environments[config.defaultEnvironment];
    }

    return null;
}

/**
 * Gets all environments
 */
export function getAllEnvironments(): { name: string; environment: Environment; isDefault: boolean }[] {
    const config = loadConfig();

    return Object.keys(config.environments).map(name => ({
        name,
        environment: config.environments[name],
        isDefault: config.defaultEnvironment === name
    }));
}

/**
 * Gets a specific environment by name
 */
export function getEnvironment(name: string): Environment | null {
    const config = loadConfig();
    return config.environments[name] || null;
}
