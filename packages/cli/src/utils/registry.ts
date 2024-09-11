import registryData from "../registry/registry.json";

function getRegistryData() {
  return registryData;
}

export function getRegistryIndex() {
  const data = getRegistryData();
  return data.components;
}

function getHiddenComponent(name: string) {
  const data = getRegistryData();
  return data.hiddenComponents.find((item: any) => item.name === name);
}

export function fetchComponent(
  name: string,
  fetchedComponents = new Set(),
) {
  const index = getRegistryIndex();
  let component = index.find((item: any) => item.name === name);

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