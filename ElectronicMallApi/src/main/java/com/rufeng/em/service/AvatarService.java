package com.rufeng.em.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.SecureUtil;
import com.rufeng.em.constants.Constants;
import com.rufeng.em.config.UploadStorageProperties;
import com.rufeng.em.entity.Avatar;
import com.rufeng.em.exception.ServiceException;
import com.rufeng.em.mapper.AvatarMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;
import java.util.UUID;

@Service
public class AvatarService {
    @Resource
    private AvatarMapper avatarMapper;
    @Resource
    private UploadStorageProperties uploadStorageProperties;

    public String upload(MultipartFile uploadFile){
        String url = null;
        //通过md5判断文件是否已经存在，防止在服务器存储相同文件
        InputStream inputStream = null;
        try {
            inputStream = uploadFile.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String md5 = SecureUtil.md5(inputStream);
        Avatar dbAvatar = avatarMapper.selectByMd5(md5);
        if(dbAvatar==null){
            String originalFilename = uploadFile.getOriginalFilename(); //文件原始名字
            String type = originalFilename.substring(originalFilename.lastIndexOf(".")+1);  //文件后缀
            System.out.println(originalFilename+"   "+type);
            long size = uploadFile.getSize() / 1024; //文件大小，单位kb
            //File does not exist，则保存文件
            File folder = new File(uploadStorageProperties.getAvatarFolderPath());
            if(!folder.exists()){
                folder.mkdirs();
            }
            String folderPath = folder.getAbsolutePath()+"/";   //文件存储文件夹的位置
            System.out.println("File storage path: "+folderPath);


            //将文件保存为UUID的名字，通过uuid生成url
            String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
            String finalFileName = uuid+"."+type;
            File targetFile = new File(folderPath + finalFileName);
            try {
                uploadFile.transferTo(targetFile);
            } catch (IOException e) {
                e.printStackTrace();
            }
            url = "/avatar/"+finalFileName;
            Avatar avatar = new Avatar(type, size, url, md5);
            System.out.println(avatar);
            avatarMapper.save(avatar);
            return url;
        }
        return dbAvatar.getUrl();
    }
    //根据文件名下载文件
    public void download(String fileName, HttpServletResponse response){
        File file = new File(uploadStorageProperties.getAvatarFolderPath()+fileName);
        if(!file.exists()){
            throw new ServiceException(Constants.CODE_500,"File does not exist");
        }
        try {
            ServletOutputStream os = response.getOutputStream();
            response.addHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode(fileName,"UTF-8"));
            response.setContentType("application/octet-stream");
            os.write(FileUtil.readBytes(file));
            os.flush();
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public int delete(int id) {
        Avatar avatar = avatarMapper.selectById(id);
        int delete = avatarMapper.delete(id);
        System.out.println(delete);
        if(delete==1){
            String fileName = StrUtil.subAfter(avatar.getUrl(),"/",true);
            System.out.println(fileName);
            File file = new File(uploadStorageProperties.getAvatarFolderPath()+fileName);
            System.out.println(file.getAbsolutePath());
            if(file.exists()){

                boolean delete1 = file.delete();
                if(delete1){
                    System.out.println("Deleted successfully");
                }
            }
        }
        return delete;
    }

    public List<Avatar> selectPage(int index, int pageSize) {
        return avatarMapper.selectPage(index,pageSize);
    }

    public int getTotal() {
        return avatarMapper.getTotal();
    }
}
