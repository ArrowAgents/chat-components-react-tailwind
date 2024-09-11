"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistryIndex = getRegistryIndex;
exports.fetchComponent = fetchComponent;
const registry_json_1 = __importDefault(require("../registry/registry.json"));
function getRegistryData() {
    return registry_json_1.default;
}
function getRegistryIndex() {
    const data = getRegistryData();
    return data.components;
}
function getHiddenComponent(name) {
    const data = getRegistryData();
    return data.hiddenComponents.find((item) => item.name === name);
}
function fetchComponent(name, fetchedComponents = new Set()) {
    const index = getRegistryIndex();
    let component = index.find((item) => item.name === name);
    if (!component) {
        component = getHiddenComponent(name);
    }
    if (!component) {
        throw new Error(`Component ${name} not found in registry.`);
    }
    fetchedComponents.add(component);
    if (component.dependencies && Array.isArray(component.dependencies)) {
        for (const depName of component.dependencies) {
            if (!fetchedComponents.has(depName)) {
                fetchComponent(depName, fetchedComponents);
            }
        }
    }
    return Array.from(fetchedComponents);
}
