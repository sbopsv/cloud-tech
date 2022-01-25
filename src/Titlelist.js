import React from 'react';
import './components/styles.css';

const Titlelist = ({ metaTitle, metaDescription, url, imageurl, date, author}) => {
  return (
    <>
      <div className="titlelistSection">
      <a href={url}>
        <div className="titlelistImg">
            <img loading="lazy" src={imageurl} alt={metaTitle} />
        </div>
        </a>
        
        <div className="titlelistDetails">
          <div className="titlelistName">
          <a href={url}>
            <div className="titlelist">{metaTitle}</div>
          </a>
          </div>
          <a href={url}>
            <div className="titlelistDesc">{metaDescription}</div>
          </a>
          <div className="titlelistAuthor">記事作成者：{author}</div>
          <div className="titlelistDate">記事作成日：{date}</div>          
          </div>
         
      </div>
    </> 
  );
};

export default Titlelist;

// ToDo:2021/09/02
// graphqlから自動でTitle一覧を取得、アウトプットしたいけど、１．見出し用画像データの設定　がネックなので、メタデータの改修が先
// ただし、mdファイルによっては画像データがない場合があるため、マニュアル対応・・・
/* example>

<Titlelist 
    metaTitle="ApsaraDB for ClickHouseの紹介"
    metaDescription="ApsaraDB for ClickHouseの紹介"
    url="http://localhost:8000/usecase-ClickHouse/ACH_001_what-is-clickhouse"
    imageurl="https://raw.githubusercontent.com/sbcloud/help/master/content/usecase-ClickHouse/AI_images_26006613460940500/20191113152500.png"
    date="2021/07/15"
    author="Hironobu Ohara"
/>

*/