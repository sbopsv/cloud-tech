import React, { Fragment } from "react";
import styled from "styled-components";
import { PoweredBy } from "react-instantsearch-dom";
import { TYPOGRAPHY } from "../../globals/designSystem";

const StyledSearchFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 4rem;
  ${TYPOGRAPHY.description_1};
  p {
    margin: 0 0 1rem;
  }
`;

const SearchFooter = () => (
  <Fragment>
    <hr />
    <StyledSearchFooter>
      <div className="community-links-wrapper">
        <p>お探しのものが見つからない場合、ソフトバンクでは無料でなんでも気軽に相談することが出来ます。</p>
        <p>
          {" "}
          <a href="https://www.softbank.jp/biz/services/platform/alibabacloud/" target="_blank" rel="noopener noreferrer">
          ソフトバンクのAlibaba Cloudサービス
          </a>{" "}
          、もしくは{" "}
          <a
            href="https://tm.softbank.jp/form/cloud/alibabacloud/index.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            Alibaba Cloudに関するお問い合わせ
          </a>
          {" "}
          まで{" "}
        </p>
      </div>

    </StyledSearchFooter>
  </Fragment>
);

export default SearchFooter;
