package com.rufeng.em.service;

import cn.hutool.core.io.FileUtil;
import cn.hutool.crypto.SecureUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rufeng.em.constants.Constants;
import com.rufeng.em.config.UploadStorageProperties;
import com.rufeng.em.entity.MyFile;
import com.rufeng.em.exception.ServiceException;
import com.rufeng.em.mapper.FileMapper;
import com.sun.xml.fastinfoset.stax.events.Util;
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
public class FileService extends ServiceImpl<FileMapper, MyFile> {
    @Resource
    private FileMapper fileMapper;
    @Resource
    private UploadStorageProperties uploadStorageProperties;

    public String upload(MultipartFile uploadFile){
        String originalFilename = uploadFile.getOriginalFilename(); //文件原始名字
        String type = originalFilename.substring(originalFilename.lastIndexOf(".")+1);  //文件后缀
        long size = uploadFile.getSize() / 1024; //文件大小，单位kb
        String url;
        MyFile myFile = new MyFile();  //用于保存于数据库的实体类Files
        myFile.setName(originalFilename);
        myFile.setSize(size);
        myFile.setType(type);

        //通过md5判断文件是否已经存在，防止在服务器存储相同文件
        InputStream inputStream = null;
        try {
            inputStream = uploadFile.getInputStream();
        } catch (IOException e) {
            e.printStackTrace();
        }
        String md5 = SecureUtil.md5(inputStream);
        QueryWrapper<MyFile> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("md5",md5);
        List<MyFile> dbMyFileList = fileMapper.selectList(queryWrapper);
        if(dbMyFileList.size() != 0){
            //数据库中已有该md5，则拷贝其url
            url = dbMyFileList.get(0) .getUrl();
            myFile.setUrl(url);
        }else{
            //File does not exist，则保存文件
            File folder = new File(uploadStorageProperties.getFileFolderPath());
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
            url = "/file/"+finalFileName;
            myFile.setUrl(url);
        }
        myFile.setMd5(md5);

        fileMapper.insert(myFile);
        System.out.println("文件"+originalFilename+" "+url);
        return url;
    }

    //根据文件名下载文件
    public void download(String fileName, HttpServletResponse response){
        File file = resolveDownloadFile(fileName);
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

    File resolveDownloadFile(String fileName) {
        File uploadedFile = new File(uploadStorageProperties.getFileFolderPath() + fileName);
        if (uploadedFile.exists()) {
            return uploadedFile;
        }
        return new File(System.getProperty("user.dir"), "file" + File.separator + fileName);
    }
    public int fakeDelete(int id){
        UpdateWrapper<MyFile> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id",id).set("is_delete",true);
        return fileMapper.update(null,updateWrapper);
    }

    public IPage<MyFile> selectPage(int pageNum,int pageSize,String fileName) {
        IPage<MyFile> filesPage = new Page<>(pageNum, pageSize);
        QueryWrapper<MyFile> filesQueryWrapper = new QueryWrapper<>();
        if(!Util.isEmptyString(fileName)){
            filesQueryWrapper.like("name",fileName);
        }
        filesQueryWrapper.eq("is_delete",false);
        filesQueryWrapper.orderByDesc("id");
        return page(filesPage, filesQueryWrapper);
    }


    public int changeEnable(int id, boolean enable) {
        UpdateWrapper<MyFile> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id",id).set("enable",enable);
        return fileMapper.update(null, updateWrapper);
    }
}
