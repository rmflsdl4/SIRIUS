package com.culiso.culiso.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "file")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    @Getter @Setter
    private int file_upload_num;

    @Column(nullable = false)
    @Getter @Setter
    private String file_url;

    @Column(nullable = false)
    @Getter @Setter
    private String file_name;

    @Column(nullable = false)
    @Getter @Setter
    private String user_id;

    @Column(nullable = false)
    @Getter @Setter
    private int contents_num;
}
