/**
 * 找到树节点
 * @param {Array} tree 树对象
 * @param {String} key 键
 * @param {Any} value 值
 */
const getTreeNode = (tree, key, value) => {
    if(!tree || !key || !value) return;
    let results = [];
    function walk(node) {
        if (node[key] === value) {
            results.push(node)
        }
        if (node.childTree && node.childTree.length > 0) {
            for (let i = 0; i < node.childTree.length; i += 1) {
                walk(node.childTree[i])
            }
        }
    }
    for (let i = 0; i < tree.length; i += 1) {
        walk(tree[i])
    }
    return results;
};
