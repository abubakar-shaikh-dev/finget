import React, { useEffect, useState, useRef } from "react";
import { Modal, Tag, Button, Input, Space, Table } from "antd";
import axiosInstance from "../../api/axiosInstance";
import ManageTransactionModal from "./ManageTransactionSidebar";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import { useLocalStorage } from "@mantine/hooks";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function Transactions() {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [id, setId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  //LocalStorage States
  const [selectedAccount] = useLocalStorage({
    key: "selectedAccount",
  });
  const [fromDate] = useLocalStorage({
    key: "fromDate",
  });
  const [toDate] = useLocalStorage({
    key: "toDate",
  });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "S.No",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 10,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) =>
        moment(record.date).tz("Asia/Kolkata").format("DD-MM-YYYY"),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: "Account",
      dataIndex: "account",
      key: "account",
      render: (text, record) => text.name,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => text.name,
      sorter: (a, b) => a.category.name.localeCompare(b.category.name),
    },
    {
      title: "Payee",
      dataIndex: "payee",
      key: "payee",
      ...getColumnSearchProps("payee"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text, record) => {
        if (record.category.type === "INCOME") {
          return (
            <Tag color="green">
              +{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
              }).format(text)}
            </Tag>
          );
        } else {
          return (
            <Tag color="red">
              -{" "}
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
              }).format(text)}
            </Tag>
          );
        }
      },
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex items-center justify-start">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => {
              setId(record._id);
              setModalVisible(true);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 hover:text-red-900 ml-4"
            onClick={() => {
              setDeleteId(record._id);
              setDeleteModalVisible(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/transaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ...(selectedAccount !== "1" && { account: selectedAccount }),
          fromDate: fromDate,
          toDate: toDate,
        },
      });
      setData(response.data.data);
      setInitLoading(false);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTransaction = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/transaction/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Transaction deleted successfully", { duration: 4000 });
      fetchData();
      setDeleteId(null);
      setDeleteModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction", { duration: 4000 });
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAccount, fromDate, toDate]);

  return (
    <>
      <ManageTransactionModal
        open={modalVisible}
        setOpen={setModalVisible}
        fetchData={fetchData}
        id={id}
        setId={setId}
      />

      <Modal
        confirmLoading={loading}
        title={"Attention Required !"}
        open={deleteModalVisible}
        setOpen={setDeleteModalVisible}
        okButtonProps={{
          className:
            "bg-gray-800 hover:!bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50",
        }}
        okText="Delete"
        onOk={deleteTransaction}
        cancelText="Cancel"
        onCancel={() => {
          setId(null);
          setDeleteModalVisible(false);
        }}
      >
        Are you sure you want to delete this transaction?
      </Modal>

      <div className="px-4 sm:px-6 lg:px-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage All the Transactions of your Finance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => setModalVisible(true)}
            >
              Add Transaction
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <Table
                  loading={initLoading || loading}
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
