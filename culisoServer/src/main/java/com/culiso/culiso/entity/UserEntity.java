package com.culiso.culiso.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
public class UserEntity {
    @Id
    @Column(nullable = false)
    @Getter @Setter
    private String userID;

    @Column(nullable = false)
    @Getter @Setter
    private String userPW;
}
