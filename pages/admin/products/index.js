import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import { EndPoint, ProductsList, ProductsAll, AddProducts } from "../../../SystemApis";

import { Button, notification } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import AdminLayout from "../../../layouts/AdminLayout";

function AdminProducts() {
  const router = useRouter();

  const [tableData, setTableData] = useState([]);

  const deleteHandler = (key) => {
    fetch(EndPoint + AddProducts + "/" + key, {
      method: "DELETE",
      headers: {
        Authorization: getCookie("adminToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        notification.open({
          description: data.message,
        });
      });
  };

  const editHandler = (id, name) => {
    //console.log(`User with id ${key} is edited!`)
    router.push("/admin/products/" + name);
  };

  //Table Structures
  const [sortedInfo, setSortedInfo] = useState({});

  const tableStructure = [
    {
      title: "No.",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (record) => (
        <img src={EndPoint + record} style={{ width: "8vw" }} />
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size={"large"}
            onClick={() => editHandler(record.id, record.name)}
          />
          &nbsp;
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            size={"large"}
            onClick={() => deleteHandler(record.id)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    fetch(EndPoint + ProductsAll, {
      headers: {
        Authorization: getCookie("adminToken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data.data)
        setTableData(data.data);
      });
  }, []);

  return (
    <AdminLayout
      title="Products"
      singleWord="Product"
      slug="products"
      addButton={true}
      showTable={true}
      tableStructure={tableStructure}
      tableData={tableData}
      onSetSortedInfo={setSortedInfo.bind()}
    />
  );
}

export default AdminProducts;
