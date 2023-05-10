import { TreeItem } from "@mui/lab";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TCategoryNode } from "~/utils/generateCategoryTree";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface IProps {
    node: TCategoryNode,
    categoryId: string,
    setCategoryId: Dispatch<SetStateAction<string>> 
}

export default function CategoryNodes({ node, categoryId, setCategoryId }: IProps) {
    const currentIcon = node.category.categoryId === categoryId ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;    

    return (
        <>
            {
                node.childrenNodes.length > 0 ?
                    <TreeItem nodeId={node.category.categoryId} label={node.category.categoryName}>
                        {
                            node.childrenNodes && node.childrenNodes.length > 0 &&
                            node.childrenNodes.map(child => {
                                return (
                                    <CategoryNodes categoryId={categoryId} setCategoryId={setCategoryId} key={child.category.categoryId} node={child} />
                                )
                            })
                        }
                    </TreeItem> :
                    <TreeItem icon={currentIcon} label={node.category.categoryName} onClick={() => setCategoryId(node.category.categoryId)} nodeId={node.category.categoryId}/>
            }

        </>
    )
}