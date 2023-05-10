import type { Category } from "@prisma/client"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { api } from "~/utils/api";
import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { TCategoryTree, generateCategoryTree } from "~/utils/generateCategoryTree";
import CategoryNodes from "./CategoryNodes";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface IProps {
    categoryId: string,
    setCategoryId: Dispatch<SetStateAction<string>> 
}

export default function CategoryTree({categoryId, setCategoryId}: IProps) {
    const [categoryTree, setCategoryTree] = useState<TCategoryTree | undefined>(undefined);
    const allCategories = api.category.getAll.useQuery(undefined, {
        enabled: false
    });

    const currentIcon = categoryId === '' ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;  

    useEffect(() => {
        const fetchData = async () => {
            const dataApi = await allCategories.refetch();
            if (dataApi.data) setCategoryTree(generateCategoryTree(dataApi.data));
        }

        fetchData()
            .catch(console.error);
    }, [])

    return (
        <>
            {
                categoryTree && categoryTree.categoryNode.length > 0 &&
                <>                    
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        <TreeItem icon={currentIcon} onClick={() => setCategoryId('')} label="Все категории" nodeId="0"/>
                        {
                            categoryTree.categoryNode.map(node => {
                                return (
                                    <CategoryNodes categoryId={categoryId} setCategoryId={setCategoryId} key={node.category.categoryId} node={node} />
                                );
                            })
                        }
                    </TreeView>
                </>
            }
        </>
    )
}