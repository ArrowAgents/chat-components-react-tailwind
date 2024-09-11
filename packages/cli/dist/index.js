#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const add_js_1 = require("./commands/add.js");
const program = new commander_1.Command();
program
    .name("chat-components-shadcn-cli")
    .description("CLI for adding chat components to your project")
    .version("0.2.0");
program.addCommand(add_js_1.add);
program.parse(process.argv);
