import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Table } from 'react-bootstrap'
import onlineIcon from '../images/online.svg';
import offlineIcon from '../images/offline.svg';

const Stock = () => {
  const data = useStaticQuery(graphql`
  query ecsPrePayPayQuery {
    firstPost: allEcsPrePayApNortheast1ResultsJson(
      sort: {fields: instance_name}
      filter: {instance_status: {eq: "available"}}){
      edges {
        node {
          id
          instance_name
          instance_zoneId
          instance_orderType
          instance_status
          instance_statusCategory
          instance_isPostpay
          update_date
        }
      }
    }
    secondPost: allEcsPrePayApNortheast1ResultsJson(
    sort: {fields: instance_name}
    filter: {instance_status: {ne: "available"}}){
    edges {
      node {
        id
        instance_name
        instance_zoneId
        instance_orderType
        instance_status
        instance_statusCategory
        instance_isPostpay
        update_date
      }
    }
  }
  }`
)
  

  return (
    <>
    <h3 class="heading3">在庫切れ一覧</h3>
    <Table striped bordered hover variant="dark" size="sm" responsive>
    <tbody>
    <th>status</th><th style={{ width: "180px"}}>インスタンス名</th><th style={{ width: "150px"}}>Zone</th><th style={{ width: "90px"}}>ステータス</th><th style={{ width: "115px"}}>最終更新日</th>
      {getSoldout(data)}
    </tbody>
    </Table>

    <h3 class="heading3">在庫有り一覧</h3>        
    <Table striped bordered hover variant="dark" size="sm" responsive>
    <tbody>
      <th>status</th><th style={{ width: "180px"}}>インスタンス名</th><th style={{ width: "150px"}}>Zone</th><th style={{ width: "90px"}}>ステータス</th><th style={{ width: "115px"}}>最終更新日</th>
      {getStock(data)}
    </tbody>
    </Table>
    </>
  )
};

function getStock(data) {
  const StockArray = [];

  data.firstPost.edges.forEach(item =>        
        StockArray.push(
            <tr>
                <td style={{ width: "32px"}}><img className="onlineIcon" src={onlineIcon} alt="online" /></td>
                <td key={item.node.instance_name}>{item.node.instance_name}</td>
                <td key={item.node.instance_zoneId}>{item.node.instance_zoneId}</td>
                <td key={item.node.instance_status}>{item.node.instance_status}</td>
                <td key={item.node.update_date}>{item.node.update_date}</td>
            </tr>
        )

  );
  return StockArray;
};


function getSoldout(data) {
  const SoldoutArray = [];

  data.secondPost.edges.forEach(item =>        
    SoldoutArray.push(
            <tr>
                <td style={{ width: "32px"}}><img className="offlineIcon" src={offlineIcon} alt="offline" /></td>
                <td key={item.node.instance_name}>{item.node.instance_name}</td>
                <td key={item.node.instance_zoneId}>{item.node.instance_zoneId}</td>
                <td key={item.node.instance_status}>{item.node.instance_status}</td>
                <td key={item.node.update_date}>{item.node.update_date}</td>
            </tr>
        )

  );
  return SoldoutArray;
};

export default Stock
