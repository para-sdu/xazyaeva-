package com.assignment3.project.mappers;

import com.assignment3.project.dto.responses.DonationResponse;
import com.assignment3.project.entities.Donation;
import com.assignment3.project.entities.Project;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-05-03T01:05:40+0500",
    comments = "version: 1.6.2, compiler: javac, environment: Java 25.0.1 (Oracle Corporation)"
)
@Component
public class DonationMapperImpl implements DonationMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public DonationResponse toDto(Donation entity) {
        if ( entity == null ) {
            return null;
        }

        DonationResponse donationResponse = new DonationResponse();

        donationResponse.setProjectId( entityProjectId( entity ) );
        donationResponse.setId( entity.getId() );
        donationResponse.setAmount( entity.getAmount() );
        donationResponse.setDonor( userMapper.toDto( entity.getDonor() ) );
        donationResponse.setCreatedAt( entity.getCreatedAt() );

        return donationResponse;
    }

    private Long entityProjectId(Donation donation) {
        Project project = donation.getProject();
        if ( project == null ) {
            return null;
        }
        return project.getId();
    }
}
