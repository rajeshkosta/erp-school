import React, { useState, useEffect } from "react";
import { PickList } from "primereact/picklist";

const PickGridTable = ({
  dataKey,
  source,
  onChange,
  target,
  filterBy,
  filter,
  targetHeader,
  itemTemplate,
  sourceHeader,
  sourceFilterPlaceholder,
  targetFilterPlaceholder,
}) => {
  return (
    <div className="card">
      <PickList
        dataKey={dataKey}
        source={source}
        target={target}
        onChange={onChange}
        filter={filter}
        filterBy={filterBy}
        itemTemplate={itemTemplate}
        breakpoint="1280px"
        sourceHeader={sourceHeader}
        targetHeader={targetHeader}
        sourceStyle={{ height: "24rem" }}
        targetStyle={{ height: "24rem" }}
        sourceFilterPlaceholder={sourceFilterPlaceholder}
        targetFilterPlaceholder={targetFilterPlaceholder}
      />
     
    </div>
  );
};

export default PickGridTable;
