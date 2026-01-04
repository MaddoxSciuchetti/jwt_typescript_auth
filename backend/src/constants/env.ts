const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if(value == undefined){
        throw new Error("Missing environment variable")
    }

    return value;
}

export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET")
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET")

