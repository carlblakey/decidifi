import React from "react";
import { Col, Row, Statistic, Card } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, LikeOutlined, CheckOutlined } from '@ant-design/icons';

const DashboardCard = () => {
  return (
    <Row gutter={16}>
      {/* Total Decisions */}
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Total Decisions"
            value={1128}
            valueStyle={{ color: "#3f8600" }}
            prefix={<CheckOutlined />}
          />
        </Card>
      </Col>
      
      {/* Positive Decisions */}
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Positive Decisions"
            value={812}
            precision={0}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
            suffix="(72%)"
          />
        </Card>
      </Col>

      {/* Negative Decisions */}
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Negative Decisions"
            value={316}
            precision={0}
            valueStyle={{ color: "#cf1322" }}
            prefix={<ArrowDownOutlined />}
            suffix="(28%)"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCard;