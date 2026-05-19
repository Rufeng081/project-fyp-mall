package com.rufeng.em.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.rufeng.em.entity.MyFile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileMapper extends BaseMapper<MyFile> {
}
