package com.rufeng.em.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.rufeng.em.entity.Icon;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.rufeng.em.entity.IconCategory;
import com.rufeng.em.mapper.IconCategoryMapper;
import com.rufeng.em.mapper.IconMapper;
import com.rufeng.em.utils.BaseApi;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class IconService extends ServiceImpl<IconMapper, Icon> {

    @Resource
    private IconMapper iconMapper;

    @Resource
    private IconCategoryMapper iconCategoryMapper;

    public List<Icon> getIconCategoryMapList() {
        return iconMapper.getIconCategoryMapList();
    }

    /**
     * 删除上级分类
     *
     * @param id id
     */
    public Map<String, Object> deleteById(Long id) {
        // 检查是否包含下级分类
        Long count = iconCategoryMapper.selectCount(
                new QueryWrapper<IconCategory>().eq("icon_id", id)
        );
        if (count > 0) {
            return BaseApi.error("This category group still has subcategories. Delete all subcategories first.");
        }
        super.removeById(id);
        return BaseApi.success();
    }
}
