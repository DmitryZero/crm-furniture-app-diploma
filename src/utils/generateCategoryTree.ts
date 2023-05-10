import { Category } from "@prisma/client";

interface TCategoryTree {
    categoryNode: TCategoryNode[]
}

interface TCategoryNode {
    category: Category;
    childrenNodes: TCategoryNode[]
}

function generateCategoryTree(categories: Category[]) {
    return assembleCategories(categories);
}

function assembleCategories(initialCategories: Category[]): TCategoryTree {
    const finalCategories: TCategoryTree = {
        categoryNode: []
    };
    
    const parentCategories = initialCategories.filter(item => item.parentCategoryId === null);
    
    for (let i = 0; i < parentCategories.length; i++) {        
        const newChildren = getChildCategories(parentCategories[i]!, initialCategories);        
        finalCategories.categoryNode.push(newChildren);
    }
 
    return finalCategories;
}

function getChildCategories(category: Category, categoryArray: Category[]): TCategoryNode {
    const newCategories: TCategoryNode = {
        category: category,
        childrenNodes: []
    };
    
    const children = categoryArray.filter(item => item.parentCategoryId === category.categoryId);
    if (children.length === 0) return newCategories;    

    for (let i = 0; i < children.length; i++) {
        const currentCategory = children[i];
        const newChildren = getChildCategories(currentCategory!, categoryArray);
        
        newCategories.childrenNodes.push(newChildren);
    }

    return newCategories;
}

export {generateCategoryTree, type TCategoryTree, type TCategoryNode};