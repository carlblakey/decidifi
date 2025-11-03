import React, { useEffect, useState } from "react";
import { AdminDashboardLayout } from "../../components";
import { Button, Card, Form, Image, Input, Select, Spin, Upload } from "antd";
import { setAuthToken } from "../../api/client";
import { getToken } from "../../utilities/localStorageMethods";
import useApi from "../../hooks/useApi";
import { getAllUsers } from "../../api/user";
import { getAllScoreCard, SendScoreCardEmail } from "../../api/scorecard";
import toast from "react-hot-toast";

const SendEmail = () => {
  const [saveLoading, setSaveLoading] = useState(false);

  const [scoreCards, setScoreCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  // get all users
  const {
    data: usersData,
    isSuccess,
    loading: userLoading,
    request,
  } = useApi(getAllUsers);
  // get All ScoreCards
  const {
    data: ScoreCards,
    isSuccess: isSuccessScoreCards,
    loading: loadingScoreCards,
    request: requestScoreCards,
  } = useApi(getAllScoreCard);

  // set user token
  useEffect(() => {
    setAuthToken(getToken());
    request();
    requestScoreCards();
  }, []);

  useEffect(() => {
    if (isSuccess && usersData?.data?.length) {
      const user = usersData?.data
        .filter((user) => user.type !== "Admin")
        .map((user) => ({ _id: user._id, name: user.name }));

      setUsers(user);
    }
  }, [isSuccess, usersData]);

  useEffect(() => {
    if (isSuccessScoreCards && ScoreCards?.data?.length) {
      const sc = ScoreCards.data.map((curElem) => ({
        _id: curElem._id,
        title: curElem.title,
      }));
      setScoreCards(sc);
    }
  }, [isSuccessScoreCards, ScoreCards]);

  const handleSubmit = async (values) => {
    try {
      setSaveLoading(true);
      let res = await SendScoreCardEmail(values);

      if (res.data.status === 200) {
        toast.success(res.data.message);
        form.resetFields();
      }
    } catch (error) {
      toast.error(
        "There was an error in sending the scorecards. Please check the details and try again"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <Card
        title="Scorecard Email Manager"
        style={{ maxWidth: "70%", margin: "2rem auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-6"
        >
          <Form.Item
            name="userIds"
            label="Users"
            rules={[
              {
                required: true,
                message: "Please select at least one user",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Users"
              loading={userLoading}
              showSearch // Enable search
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              } // Optional: customize how the search is performed
            >
              {users.map((curElem) => (
                <Option value={curElem._id} key={curElem._id}>
                  {curElem.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scorecardIds"
            label="Scorecards"
            rules={[
              {
                required: true,
                message: "Please select at least one scorecard",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select Scorecards"
              loading={loadingScoreCards}
              showSearch // Enable search
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              } // Optional: customize how the search is performed
            >
              {scoreCards.map((curElem) => (
                <Option value={curElem._id} key={curElem._id}>
                  {curElem.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={saveLoading}
            >
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminDashboardLayout>
  );
};

export default SendEmail;
