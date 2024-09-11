interface AppConfig {
    name: string,
    github: {
        title: string,
        url: string
    },
    author: {
        name: string,
        url: string
    },
}

export const appConfig: AppConfig = {
    name: "Sample App",
    github: {
        title: "Starter",
        url: "https://github.com/",
    },
    author: {
        name: "",
        url: "https://github.com/",
    }
}