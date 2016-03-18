export const insertNode = (tree, filePath, node) => {
    let folders = filePath.split('/').filter(a => a).concat(node);
    return folders.reduce((prevPath, currItem) => {
      if(typeof currItem === 'object') {
        tree[prevPath].value = currItem
        return true
      } else {
        let currPath = prevPath + '/' + currItem;
        let parentObj = tree[prevPath], currObj = tree[currPath];
        if(prevPath && !parentObj) { 
          tree[prevPath] = {filePath: prevPath, children: []}
        }
        if(parentObj && parentObj.children.indexOf(currPath) === -1) {
          tree[prevPath].children.push(currPath);
        }
        tree[currPath] = currObj ? currObj : {children: []};
        tree[currPath].parent = prevPath;
        tree[currPath].value = currItem;
        tree[currPath].filePath = currPath;
        if(tree.__root === undefined) {
          Object.defineProperty(tree, '__root', {
            value: tree[currPath]
          });
        }
        return currPath;
      }         
    }, "");
  }
export const getParent = (tree, filePath) => {
    let parentPath = tree[filePath].parent
    return tree[parentPath];
  }
export const getChildren = (tree, filePath, showConfigs) => {
    let children = tree[filePath].children.map(childPath => tree[childPath]);
    if(!showConfigs) {
      return children.filter(child => child.value.name !== '.config');
    } else {
      return children;
    }
  }
export const getAllParents = (tree, filePath) => {
    let results = [], parent = true;
    while (parent = getParent(tree, filePath)) {
      results.push(parent);
      filePath = parent.filePath;
    }
    return results;
  }

export const getAllChildren = (tree, filePath, showConfigs) => {
    let children = getChildren(tree, filePath, showConfigs);
    if(children.length === 0) {
      return [];
    } else {
      return children.reduce((results, child) => {
        let childPath = child.filePath;
        let children = getChildren(tree, childPath, showConfigs);
        return results.concat(child, children);  
      }, []);
    }
  }
export const deleteNode = (tree, filePath) => {
    let childrenPaths = getAllChildren(tree, filePath).map(child => child.filePath);
    let parent = getParent(tree, filePath);
    childrenPaths.forEach(childPath => {
      delete tree[childPath];
    });
    parent.children = parent.children.filter(childPath => childPath !== filePath);
  }


export const convertToTree = (snippetObj) => {
  let userTreeMap = {};
  Object.keys(snippetObj).forEach((key) => {
    insertNode(userTreeMap, key, snippetObj[key]);
  })
  return userTreeMap
}


