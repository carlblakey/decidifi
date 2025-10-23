import React, { useEffect, useState } from "react";
import { Footer, Header } from "../../components";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { getEmailSubscription, updateEmailSubscription } from "../../api/user";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const UnsubscribeEmail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [hasSubscribedBefore, setHasSubscribedBefore] = useState(true);

  const [loading, setloading] = useState(false);
  const [getloading, setGetLoading] = useState(false);

  const getSubscription = async () => {
    try {
      setGetLoading(true);
      const res = await getEmailSubscription(id);
      if (res.status === 200) {
        setHasSubscribedBefore(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
    } finally {
      setGetLoading(false);
    }
  };

  useEffect(() => {
    getSubscription();
  }, []);

  const handleUnsubscribe = async () => {
    try {
      setloading(true);
      const res = await updateEmailSubscription(id);
      if (res.status === 200) {
        toast.dismiss();
        toast.success("Unsubscribe completed successfully");
        setHasSubscribedBefore(false);
      } else {
        toast.dismiss();
        toast.error("We couldn't unsubscribe. Please try again later");
      }
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col px-8">
        <div className="max-w-7xl m-auto">
          {getloading ? (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Spin size="large" tip="Loading..." />
            </div>
          ) : (
            <div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {!hasSubscribedBefore ? (
                  <h3 className="text-xl">
                    You have successfully unsubscribed. From now on, you will no
                    longer receive any emails from us.
                  </h3>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                      Are you sure you want to unsubscribe from our emails?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      If you unsubscribe, you will no longer receive any emails
                      from us.
                    </p>

                    <div style={{ textAlign: "center", marginTop: "30px" }}>
                      <Button
                        type="primary"
                        shape="round"
                        size="large"
                        icon={<CheckCircleOutlined />}
                        onClick={handleUnsubscribe}
                        disabled={loading}
                        loading={loading}
                      >
                        Unsubscribe
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UnsubscribeEmail;
