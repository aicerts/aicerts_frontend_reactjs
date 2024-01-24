import React from 'react';
import profileData from '../data/profileData.json';

const ProfileDetails = () => {
    const dynamicHeight = '5px';
    const profile = profileData[0];

    // const FormFields = ({ formData }) => {
    //     return (
    //       <div className="card">
    //         <div className="card-body">
    //           {profile.formData.map((field, index) => (
    //             <div key={index} className="row mb-3">
    //               <div className="col-sm-3">
    //                 <h6 className="mb-0">{field.label}</h6>
    //               </div>
    //               <div className="col-sm-9 text-secondary">
    //                 <input type={field.type} className="form-control" value={field.value} />
    //               </div>
    //             </div>
    //           ))}
    //           <div className="row">
    //             <div className="col-sm-3"></div>
    //             <div className="col-sm-9 text-secondary">
    //               <input type="button" className="btn btn-primary px-4" value="Save Changes" />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   };

    return (
        <>
            <div className="container mt-5 mb-5">
                <div className="main-body">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <img
                                            src={profile.profileImage}
                                            alt="Profile"
                                            className="rounded-circle p-1 bg-primary"
                                            width="110"
                                        />
                                        <div className="mt-3">
                                            <h4>{profile.name}</h4>
                                            <p className="text-secondary mb-1">{profile.role}</p>
                                            <p className="text-muted font-size-sm">{profile.location}</p>
                                            <button className="btn btn-primary">Follow</button>
                                            <button className="btn btn-outline-primary ms-3">Message</button>
                                        </div>
                                    </div>
                                    <hr class="my-4" />
                                    <ul className="list-group list-group-flush">
                                        {profile.socialMedia[0].map((item) => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                <h6 className="mb-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-${item.icon} me-2 icon-inline`}>
                                                        {item.icon === "globe" && <circle cx="12" cy="12" r="10"></circle>}
                                                        {item.icon === "github" && <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>}
                                                        {item.icon === "twitter" && <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>}
                                                        {item.icon === "facebook" && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>}
                                                    </svg>
                                                    {item.title}
                                                </h6>
                                                <span className="text-secondary">{item.url || item.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div class="card">
                                <div class="card-body">
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Full Name</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text" class="form-control" value="John Doe" />
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Email</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text" class="form-control" value="john@example.com" />
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Phone</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text" class="form-control" value="(239) 816-9029" />
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Mobile</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text" class="form-control" value="(320) 380-4539" />
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0">Address</h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="text" class="form-control" value="Bay Area, San Francisco, CA" />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-3"></div>
                                        <div class="col-sm-9 text-secondary">
                                            <input type="button" class="btn btn-primary px-4" value="Save Changes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="d-flex align-items-center mb-3">Project Status</h5>
                                            {profile.projects.map((project, index) => (
                                                <div key={index}>
                                                    <p>{project.name}</p>
                                                    <div
                                                        className={`progress mb-3 ${dynamicHeight}`}
                                                        style={{ height: dynamicHeight }}
                                                    >
                                                        <div
                                                            className={`progress-bar ${project.color}`}
                                                            role="progressbar"
                                                            style={{ width: `${project.progress}%` }}
                                                            aria-valuenow={project.progress}
                                                            aria-valuemin="0"
                                                            aria-valuemax="100"
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileDetails;
