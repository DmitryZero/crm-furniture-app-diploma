import { TreeItem } from "@mui/lab";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import type { TCategoryNode } from "~/utils/generateCategoryTree";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import type IFilter from "~/interfaces/IFilter";

interface IProps {
    node: TCategoryNode,
    categoryId: string | undefined,
    setProductFilter?: Dispatch<SetStateAction<IFilter>>,
}

export default function CategoryNodes({ node, categoryId, setProductFilter }: IProps) {
    const currentIcon = node.category.categoryId === categoryId ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />;

    const handleCategoryChange = (categoryId: string | undefined) => {
        if (setProductFilter) setProductFilter((prevValue) => ({ ...prevValue, currentFilter: ({ ...prevValue.currentFilter, categoryId: categoryId }) }));
    }

    return (
        <>
            {
                node.childrenNodes.length > 0 ?
                    <TreeItem nodeId={node.category.categoryId} label={node.category.categoryName}>
                        {
                            node.childrenNodes && node.childrenNodes.length > 0 &&
                            node.childrenNodes.map(child => {
                                return (
                                    <CategoryNodes categoryId={categoryId} setProductFilter={setProductFilter} key={child.category.categoryId} node={child} />
                                )
                            })
                        }
                    </TreeItem> :
                    <TreeItem icon={currentIcon} label={node.category.categoryName} onClick={() => handleCategoryChange(node.category.categoryId)} nodeId={node.category.categoryId} />
            }

        </>
    )
}