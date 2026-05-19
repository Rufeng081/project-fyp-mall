package com.rufeng.em.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.rufeng.em.entity.Standard;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rufeng.em.mapper.StandardMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class StandardService extends ServiceImpl<StandardMapper, Standard> {

    @Resource
    private StandardMapper standardMapper;

    public boolean delete(Standard standard) {
        QueryWrapper<Standard> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("good_id",standard.getGoodId());
        queryWrapper.eq("value",standard.getValue());
        return remove(queryWrapper);
    }


    public void deleteAll(int GoodId) {
        QueryWrapper<Standard> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("good_id",GoodId);
        remove(queryWrapper);
    }
}
