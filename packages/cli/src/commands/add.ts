import { Command } from "commander";
import { confirm, select } from '@inquirer/prompts';
import { getRegistryIndex, fetchComponent } from "../utils/registry";
import { writeComponentFiles } from "../utils/file-operations";
import path from "path";
import chalk from "chalk";
import { createSpinner } from "nanospinner";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const add = new Command()
  .name("add")
  .description("Add a component to your project")
  .argument("[componentName]", "Name of the component to add")
  .option("--all", "Install all components")
  .action(async (componentName, options) => {
    try {
      const spinner = createSpinner();
      const registryIndex = await getRegistryIndex();

      let componentsToInstall: string[] = [];

      if (options.all) {
        const confirmResponse = await confirm({
          message: "Are you sure you want to install all components? This may overwrite existing files.",
          default: false,
        });

        if (!confirmResponse) {
          console.log(chalk.yellow("Installation cancelled."));
          return;
        }

        componentsToInstall = registryIndex.map((c: any) => c.name);
      } else if (!componentName) {
        const response = await select({
          message: "Select a component to add:",
          choices: registryIndex.map((c: any) => ({
            name: c.name,
            value: c.name,
          })),
        });
        componentName = response;
        if (!componentName) {
          console.log(chalk.yellow("No component selected. Exiting."));
          return;
        }
        componentsToInstall = [componentName];
      } else {
        componentsToInstall = [componentName];
      }

      for (const component of componentsToInstall) {
        if (!registryIndex.some((c: any) => c.name === component)) {
          console.error(
            chalk.red(`Component "${component}" not found in the registry.`),
          );
          continue;
        }

        spinner.start({ text: `Fetching component ${component}...`, color: 'yellow' });
        const [components] = await Promise.all([
          fetchComponent(component),
          delay(500),
        ]);
        spinner.success({text: `Component ${chalk.cyan(component)} fetched`});

        // Create the target directory if it doesn't exist
        const targetDir = path.join(
          process.cwd(),
          "src",
          "components",
          "ui",
          "chat",
        );

        spinner.start({ text:"Writing component files..."});
        await Promise.all([
          writeComponentFiles(components, targetDir),
          delay(500),
        ]);
        spinner.success({
            text: `Component ${chalk.cyan(component)} and its dependencies have been added successfully to ${chalk.cyan("src/components/ui/chat")}.`
        });

        const allDependencies = components
          .flatMap((c: any) => c.dependencies || [])
          .filter((d, i, arr) => arr.indexOf(d) === i);
        if (allDependencies.length > 0) {
          console.log(
            chalk.blue("The following dependencies were also installed:"),
          );
          console.log(chalk.cyan(allDependencies.join(", ")));
        }
      }

      if (options.all) {
        console.log(
          chalk.green("All components have been successfully installed."),
        );
      }
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });