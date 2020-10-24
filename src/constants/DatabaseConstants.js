module.exports.QUERY = {
    LISTAR_SOLICITUDES : `
    SELECT solicitud as solicitud, nombreasesor, dnicliente as dni, nombrecliente, 
    producto as productos, statusmotivo,tipomotivo,dscmotivo,statuspreemision, 
    fechacreacion, fechamodificacion, usucreacion, usumodificacion,
    estadoenvio	 
    FROM bitacorasolicitud
`,
LISTAR_SOLICITUDES_2 : `
    SELECT solicitud as solicitud, nombreasesor, dnicliente as dni, nombrecliente, 
    producto as productos, statusmotivo,tipomotivo,dscmotivo,statuspreemision, 
    fechacreacion, fechamodificacion, usucreacion, usumodificacion,
    estadoenvio	 
    FROM bitacorasolicitud where solicitud = ?
`
};

