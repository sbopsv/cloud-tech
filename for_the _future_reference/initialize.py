import requests, json
import errno, os, stat, shutil
import datetime

urllist = ["https://lin-updatecheck.oss-ap-northeast-1.aliyuncs.com/PriceStockCheck/YYYYMMDD/ECS_PostPay_ap-northeast-1_results.json","https://lin-updatecheck.oss-ap-northeast-1.aliyuncs.com/PriceStockCheck/YYYYMMDD/ECS_PrePay_ap-northeast-1_results.json"]
file_dir = "C:/Users/Administrator/Desktop/help2/help/data/"

# https://lin-updatecheck.oss-ap-northeast-1.aliyuncs.com/PriceStockCheck/20211209/ECS_PostPay_ap-northeast-1_results.json
# https://lin-updatecheck.oss-ap-northeast-1.aliyuncs.com/PriceStockCheck/20211209/ECS_PostPay_ap-northeast-1_results.csv
# https://lin-updatecheck.oss-ap-northeast-1.aliyuncs.com/PriceStockCheck/20211209/ECS_PrePay_ap-northeast-1_results.json
# https://lin-updatecheck.oss-ap-northeast-1.aliyuncs.com/PriceStockCheck/20211209/ECS_PrePay_ap-northeast-1_results.csv

# Saving a json file
def download_files(url,file_dir):
    response = requests.get(url)
    filename = os.path.basename(url)
    print(filename)
    
    try:
        response_status = response.raise_for_status()
    except Exception as exc:
        print("Error:{}".format(exc))
    else:
        data = response.json()
        with open(file_dir + "/" + filename, 'w') as f:
            json.dump(data, f)

# Old json File remove
def handleRemoveReadonly(func, path, exc):
    excvalue = exc[1]
    if func in (os.rmdir, os.remove) and excvalue.errno == errno.EACCES:
        os.chmod(path, stat.S_IRWXU| stat.S_IRWXG| stat.S_IRWXO) # 0777 
        func(path)
    else:
        raise

def init():
    try:
        shutil.rmtree(file_dir, ignore_errors=False, onerror=handleRemoveReadonly)
        os.mkdir(file_dir)
    except:
        os.mkdir(file_dir)

def main(url):
    url = url.replace('YYYYMMDD', datetime.date.today().strftime('%Y%m%d'))
    #url = url.replace('YYYYMMDD', "20211220")
    print(url)
    download_files(url, file_dir)


if __name__ == "__main__":
    init()    
    for url in urllist:    
        main(url)
    
    