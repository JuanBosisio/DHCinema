import { Button } from "@react-email/button";
import { Column } from "@react-email/column";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

const ReserveConfirmation = (imagen, titulo, descripcion, modalidad, idioma, fecha, hora, asientos ) => {

    return (
        <Html>
            <Section
                style={
                    {
                        width: '80%',
                        boxShadow: '0px 10px 20px rgba(0,0,0,.4)',
                        marginTop: '20px',
                        backgroundColor: 'rgba(119,141,169,.7)'
                    }
                }
            >
                <Section
                    style={{
                        backgroundColor: "#415A77",

                    }}
                    className="font-sans">
                    <Column style={{
                    }}
                        align="left"
                    >
                        <Img
                            style={{
                                width: '30%'
                            }}
                            src="https://res.cloudinary.com/dmnjesfeg/image/upload/v1688402161/dhcinema2-logo.png_tyjvkg.png"
                        />
                    </Column>
                    <Column style={{
                        textAlign: 'center',
                        alignItems: 'center'
                    }}
                        align="center"
                    >
                        <Heading
                            as="h2"
                            className=""
                            style={{
                                textAlign: 'center',
                                color: 'rgba(255,255,255,.7)',
                                fontWeight: '400'

                            }}
                        >
                            RESERVA CINEMADH
                        </Heading>
                    </Column>



                </Section>
                <Section
                    style={{
                        borderBottom: '1px solid white',

                    }}
                >
                    <Heading
                        style={{
                            color: "white"
                        }}
                        as="h3"
                    >Gracias por tu reserva</Heading>
                    <Text>tu reserva para {titulo} se realizo con exito.</Text>
                    <Text>El {fecha} a las {hora}, {asientos} reservados.</Text>
                </Section>
                <Section
                    style={{
                        border: '1px solid rgba(0,0,0,.2)',
                        width: '60%',
                        marginTop: '20px',
                        marginBottom: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'left'
                    }}
                >
                    <Column
                        style={{
                            textAlign: 'left',
                            alignItems: 'left',
                            paddingRight: '10px',
                            width: '20%'
                        }}
                    >
                        <Img
                            width='100%'
                            src={imagen}
                        />
                    </Column>
                    <Column
                        style={{
                            textAlign: 'left',
                            alignItems: 'left',
                            width: '80%',

                        }}
                        align="left"

                    >
                        <Heading
                            as="h4"
                            style={{

                            }}
                        >{titulo}</Heading>
                        <Text>{descripcion}</Text>
                        <Section
                            style={{
                                display: 'flex',
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'center'

                            }}
                        >
                            <Column
                                style={{
                                    textAlign: 'center',
                                    paddingRight: '10px'
                                }}
                            >
                                <Text>
                                    Modalidad:
                                    <Heading as="h4">
                                        {modalidad}
                                    </Heading>
                                </Text>
                            </Column>
                            <Column
                                style={{
                                    textAlign: 'center',
                                    paddingRight: '10px'
                                }}
                            >
                                <Text>
                                    Idioma:
                                    <Heading as="h4">
                                        {idioma}
                                    </Heading>
                                </Text>
                            </Column>
                            <Column
                                style={{
                                    textAlign: 'center',
                                    paddingRight: '10px'
                                }}
                            >
                                <Text>
                                    Asientos:
                                    <Heading as="h4">
                                        {asientos}
                                    </Heading>
                                </Text>
                            </Column>
                            <Column
                                style={{
                                    textAlign: 'center',
                                    paddingRight: '10px'
                                }}
                            >
                                <Text>
                                    Fecha:
                                    <Heading as="h4">
                                       {fecha}
                                    </Heading>
                                </Text>
                            </Column>
                            <Column
                                style={{
                                    textAlign: 'center',
                                    paddingRight: '10px'
                                }}
                            >
                                <Text>
                                    Hora:
                                    <Heading as="h4">
                                        {hora}
                                    </Heading>
                                </Text>
                            </Column>
                            
                        </Section>
                    </Column>
                </Section>
                <Button
                    style={{
                        marginTop:'20px',
                        marginBottom:'50px',
                    }}
                > <Link 
                style={{
                    backgroundColor:'#1B263B',
                    color:'white',
                    paddingLeft: '40px',
                    paddingRight: '40px',
                    paddingTop:'20px',
                    paddingBottom:'20px',
                    marginBottom:'20px',
                    
                }
                
            }
            href="http://localhost:5173/reservas/"
                >VER TUS RESERVAS</Link></Button>
                

            </Section>

        </Html>
    )
}

export default ReserveConfirmation;