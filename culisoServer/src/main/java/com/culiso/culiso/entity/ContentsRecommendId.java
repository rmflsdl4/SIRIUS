package com.culiso.culiso.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentsRecommendId implements Serializable {

    @Column(name = "user_id", nullable = false)
    private String user_id;

    @Column(name = "contents_num", nullable = false)
    private int contents_num;
}
