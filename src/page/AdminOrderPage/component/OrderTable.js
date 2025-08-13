import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data, openEditForm, searchQuery }) => {
  const renderContent = () => {
    if (data.length > 0) {
      return data.map((item, index) => (
        <tr key={item._id} onClick={() => openEditForm(item)}>
          <th>{index + 1}</th>
          <th>{item.orderNum}</th>
          <th>{item.createdAt.slice(0, 10)}</th>
          <th>{item.userId.email}</th>
          {item.items.length > 0 ? (
            <th>
              {item.items[0].productId.name}
              {item.items.length > 1 && `외 ${item.items.length - 1}개`}
            </th>
          ) : (
            <th></th>
          )}

          <th>{item.shipTo.address + " " + item.shipTo.city}</th>

          <th>{currencyFormat(item.totalPrice)}</th>
          <th>
            <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
          </th>
        </tr>
      ));
    }

    // 검색 결과가 없는 경우
    if (searchQuery?.orderNum) {
      return (
        <tr>
          <td colSpan={header.length} className="text-center">
            "{searchQuery.orderNum}"에 해당하는 주문 내역이 없습니다.
          </td>
        </tr>
      );
    }

    // 일반적으로 주문 내역이 없는 경우
    return (
      <tr>
        <td colSpan={header.length} className="text-center">
          주문 내역이 없습니다.
        </td>
      </tr>
    );
  };

  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title) => (
              <th key={title}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>{renderContent()}</tbody>
      </Table>
    </div>
  );
};
export default OrderTable;
