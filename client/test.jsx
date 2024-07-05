<div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 3 , marginTop:250} } >
                <ProjectChart onProjectSelect={handleProjectSelect} onSubProjectSelect={handleSubProjectSelect} />
            </div>
            <div style={{ flex: 2 }}>
                {selectedProject && (
                    <div>
                        <h2>Project Details</h2>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ backgroundColor:'#e3e3e3' }}>
                                        <TableCell style={{ fontWeight: 'bold' }}>Project Code</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Sub Project Code</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Total Contribution {renderTotalContributionTime()}</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Month</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedProject.details.map((detail, index) => (
                                        <TableRow key={index}  style={{ backgroundColor: index % 2 === 0 ? '#3498db' : 'white' }} onClick={() => handleSubProjectSelect(detail.subProjectCode)}>
                                            <TableCell>{detail.projectCode}</TableCell>
                                            <TableCell>{detail.subProjectCode}</TableCell>
                                            <TableCell>{formatTime(detail.totalContribution)}</TableCell>
                                            <TableCell>{detail.month}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )}
                {selectedSubProject && (
                    <div>
                        {renderMonthWiseDetails()}
                    </div>
                )}
            </div>
        </div>