import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Skeleton } from "antd";
import moment from "moment";
import ManageUserModal from "./ManageUserModal";

const UserDetailItem = ({ title, value, isEditable, onEdit }) => (
  <li>
    <a href="#" className="block hover:bg-gray-50">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium text-gray-600">
            {title} : {value}
          </p>
          <div className="ml-2 flex flex-shrink-0">
            {isEditable && (
              <p
                className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800"
                onClick={onEdit}
              >
                Edit Detail
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  </li>
);

export default function UserDetails() {
  const [data, setData] = useState({});
  const [initLoading, setInitLoading] = useState(true);
  const [modal, setModal] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    setInitLoading(true);
    axiosInstance
      .get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setInitLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setInitLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (initLoading) {
    return <Skeleton active />;
  }

  return (
    <>
      <ManageUserModal open={modal} setOpen={setModal} fetchData={fetchData} />
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          <UserDetailItem
            title="Name"
            value={data.name}
            isEditable={true}
            onEdit={() => setModal(true)}
          />
          <UserDetailItem title="Email" value={data.email} />
          <UserDetailItem
            title="Account Creation"
            value={moment(data.createdAt).format("DD-MM-YYYY")}
          />
        </ul>
      </div>
    </>
  );
}
