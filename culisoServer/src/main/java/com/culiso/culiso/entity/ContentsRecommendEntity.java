package com.culiso.culiso.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contentsrecommend")
public class ContentsRecommendEntity {

    @EmbeddedId
    @Getter @Setter
    private ContentsRecommendId id;
}
