"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
const commander_1 = require("commander");
const prompts_1 = require("@inquirer/prompts");
const registry_1 = require("../utils/registry");
const file_operations_1 = require("../utils/file-operations");
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const nanospinner_1 = require("nanospinner");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.add = new commander_1.Command()
    .name("add")
    .description("Add a component to your project")
    .argument("[componentName]", "Name of the component to add")
    .option("--all", "Install all components")
    .action(async (componentName, options) => {
    try {
        const spinner = (0, nanospinner_1.createSpinner)();
        const registryIndex = await (0, registry_1.getRegistryIndex)();
        let componentsToInstall = [];
        if (options.all) {
            const confirmResponse = await (0, prompts_1.confirm)({
                message: "Are you sure you want to install all components? This may overwrite existing files.",
                default: false,
            });
            if (!confirmResponse) {
                console.log(chalk_1.default.yellow("Installation cancelled."));
                return;
            }
            componentsToInstall = registryIndex.map((c) => c.name);
        }
        else if (!componentName) {
            const response = await (0, prompts_1.select)({
                message: "Select a component to add:",
                choices: registryIndex.map((c) => ({
                    name: c.name,
                    value: c.name,
                })),
            });
            componentName = response;
            if (!componentName) {
                console.log(chalk_1.default.yellow("No component selected. Exiting."));
                return;
            }
            componentsToInstall = [componentName];
        }
        else {
            componentsToInstall = [componentName];
        }
        for (const component of componentsToInstall) {
            if (!registryIndex.some((c) => c.name === component)) {
                console.error(chalk_1.default.red(`Component "${component}" not found in the registry.`));
                continue;
            }
            spinner.start({ text: `Fetching component ${component}...`, color: 'yellow' });
            const [components] = await Promise.all([
                (0, registry_1.fetchComponent)(component),
                delay(500),
            ]);
            spinner.success({ text: `Component ${chalk_1.default.cyan(component)} fetched` });
            // Create the target directory if it doesn't exist
            const targetDir = path_1.default.join(process.cwd(), "src", "components", "ui", "chat");
            spinner.start({ text: "Writing component files..." });
            await Promise.all([
                (0, file_operations_1.writeComponentFiles)(components, targetDir),
                delay(500),
            ]);
            spinner.success({
                text: `Component ${chalk_1.default.cyan(component)} and its dependencies have been added successfully to ${chalk_1.default.cyan("src/components/ui/chat")}.`
            });
            const allDependencies = components
                .flatMap((c) => c.dependencies || [])
                .filter((d, i, arr) => arr.indexOf(d) === i);
            if (allDependencies.length > 0) {
                console.log(chalk_1.default.blue("The following dependencies were also installed:"));
                console.log(chalk_1.default.cyan(allDependencies.join(", ")));
            }
        }
        if (options.all) {
            console.log(chalk_1.default.green("All components have been successfully installed."));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red(error.message));
    }
});
