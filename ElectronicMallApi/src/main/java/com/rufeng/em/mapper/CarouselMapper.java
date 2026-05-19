package com.rufeng.em.mapper;

import com.rufeng.em.entity.Carousel;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

public interface CarouselMapper extends BaseMapper<Carousel> {

    List<Carousel> getAllCarousel();
}
