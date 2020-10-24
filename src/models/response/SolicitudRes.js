class SolicitudRes {
  constructor({
    solicitud = undefined,
    nombreAsesor = undefined,
    dni = undefined,
    nombreCliente = undefined,
    productos = undefined,
    statusMotivo = undefined,
    tipoMotivo = undefined,
    dscMotivo = undefined,
    statusPreEmision = undefined,
    fechaCreacion = undefined,
    fechaModificacion = undefined,
    estadoenvio = undefined,
  }) {
    this.solicitud = solicitud;
    this.nombreAsesor = nombreAsesor;
    this.dni = dni;
    this.nombreCliente = nombreCliente;
    this.productos = productos;
    this.statusMotivo = statusMotivo;
    this.tipoMotivo = tipoMotivo;
    this.dscMotivo = dscMotivo;
    this.statusPreEmision = statusPreEmision;
    this.fechaCreacion = fechaCreacion;
    this.fechaModificacion = fechaModificacion;
    this.estadoenvio = estadoenvio;
  }
}

module.exports = SolicitudRes;
