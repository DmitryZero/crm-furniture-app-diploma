import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import * as React from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import type { TCategoryTree } from "~/utils/generateCategoryTree";
import { generateCategoryTree } from "~/utils/generateCategoryTree";
import CategoryNodes from "./CategoryNodes";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import type IFilter from "~/interfaces/IFilter";

interface IProps {
    categoryId: string | undefined,
    setProductFilter?: Dispatch<SetStateAction<IFilter>>,
}

export default function CategoryTree({ categoryId, setProductFilter }: IProps) {
    const [categoryTree, setCategoryTree] = useState<TCategoryTree | undefined>(undefined);
    const allCategories = api.category.getAll.useQuery(undefined, {
        enabled: false
    });

    const currentIcon = categoryId === undefined ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;

    useEffect(() => {
        const fetchData = async () => {
            const dataApi = await allCategories.refetch();
            if (dataApi.data) setCategoryTree(generateCategoryTree(dataApi.data));
        }

        fetchData()
            .catch(console.error);
    }, [])

    const handleCategoryChange = (categoryId: string | undefined) => {
        if (setProductFilter) setProductFilter((prevValue) => ({ ...prevValue, currentFilter: ({ ...prevValue.currentFilter, categoryId: categoryId }) }));
    }

    return (
        <>
            {
                categoryTree && categoryTree.categoryNode.length > 0 &&
                <>
                    <TreeView
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                    >
                        <TreeItem icon={currentIcon} onClick={() => handleCategoryChange(undefined)} label="Все категории" nodeId="0" />
                        {
                            categoryTree.categoryNode.map(node => {
                                return (
                                    <CategoryNodes categoryId={categoryId} setProductFilter={setProductFilter} key={node.category.categoryId} node={node} />
                                );
                            })
                        }
                    </TreeView>
                </>
            }
        </>
    )
}