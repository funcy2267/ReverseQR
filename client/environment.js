class EnvParser {
    constructor() {
        this.envVars = {};
    }

    async loadEnvFile(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            this.parseEnv(text);
        } catch (error) {
            console.error('Error loading .env file:', error);
        }
    }

    parseEnv(content) {
        const lines = content.split('\n');
        lines.forEach(line => {
            // Remove leading/trailing whitespace
            const trimmedLine = line.trim();

            // Skip empty lines and comments (both line and inline)
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                return;
            }

            // Handle inline comments by taking everything before #
            const cleanLine = trimmedLine.split('#')[0].trim();

            // Skip empty lines after removing inline comments
            if (!cleanLine) {
                return;
            }

            // Split key-value pair
            const [key, ...valueParts] = cleanLine.split('=');

            if (key && valueParts.length > 0) {
                // Join value parts back together in case there were multiple '=' signs
                let value = valueParts.join('=').trim();

                // Remove quotes if present and unescape escaped characters
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                    value = value.replace(/\\"/g, '"');
                }

                this.envVars[key.trim()] = value;
            }
        });
    }

    async get(key) {
        while (this.envVars[key] == undefined) {
            await sleep(500);
        }
        return this.envVars[key];
    }
}

const env_parser = new EnvParser();
env_parser.loadEnvFile('/.env');
