import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.google.gson.Gson;
import java.util.*;
import com.aliyuncs.vpc.model.v20160428.*;

public class CreateVpc {

    public static void main(String[] args) {
        DefaultProfile profile = DefaultProfile.getProfile("ap-northeast-1", "<accessKeyId>", "<accessSecret>");
        IAcsClient client = new DefaultAcsClient(profile);

        CreateVpcRequest request = new CreateVpcRequest();
        request.setRegionId("ap-northeast-1");
        request.setCidrBlock("172.16.0.0");
        request.setVpcName("sdk_vpc");
        request.setDescription("from openAPI sdk");

        try {
            CreateVpcResponse response = client.getAcsResponse(request);
            System.out.println(new Gson().toJson(response));
        } catch (ServerException e) {
            e.printStackTrace();
        } catch (ClientException e) {
            System.out.println("ErrCode:" + e.getErrCode());
            System.out.println("ErrMsg:" + e.getErrMsg());
            System.out.println("RequestId:" + e.getRequestId());
        }

    }
}
