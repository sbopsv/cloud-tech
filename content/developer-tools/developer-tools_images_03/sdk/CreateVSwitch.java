import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.profile.DefaultProfile;
import com.google.gson.Gson;
import java.util.*;
import com.aliyuncs.vpc.model.v20160428.*;

public class CreateVSwitch {

    public static void main(String[] args) {
        DefaultProfile profile = DefaultProfile.getProfile("ap-northeast-1", "<accessKeyId>", "<accessSecret>");
        IAcsClient client = new DefaultAcsClient(profile);

        CreateVSwitchRequest request = new CreateVSwitchRequest();
        request.setRegionId("ap-northeast-1");
        request.setCidrBlock("172.16.1.0/24");
        request.setVpcId("vpc-6webjhersexrdnfsb3vm4");
        request.setZoneId("ap-northeast-1a");
        request.setVSwitchName("openAPI_vsw");
        request.setDescription("from openAPI vsw");

        try {
            CreateVSwitchResponse response = client.getAcsResponse(request);
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
