import nodemailer from 'nodemailer'
import config from '../config/config.js'
import twilio from 'twilio'
import Mailgen from 'mailgen';
import { UserService, CartService, ProductService } from '../repositories/index.js';



export const checkoutGmail = async (req, res) => {
    const userId = req.session.user;
    const id = req.session.user.cart
    try {
        const user = await UserService.getById(userId);
        const destinatario = user.email;
        const productsInCart = await CartService.findById(id);

        let configCorreo = {
            service: "gmail",
            auth: {
                user: config.checkout.checkoutUser,
                pass: config.checkout.checkoutPass
            }
        };

        let transporter = nodemailer.createTransport(configCorreo);
        let Mailgenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'flower style',
                link: 'https://flowerstyle.netlify.app/'
            }
        });

        // Busco la información completa de cada producto en el carrito
        const detailedProducts = await Promise.all(productsInCart.products.map(async (product) => {
            const productDetails = await ProductService.findById(product.product);
            return {
                title: productDetails.title,
                description: productDetails.description,
                price: productDetails.price,
                quantity: product.quantity,
            };
        }));

        let response = {
            body: {
                intro: "Your bill has arrived!",
                table: {
                    data: detailedProducts.map(product => ({
                        item: product.title,
                        description: product.description,
                        price: `$${product.price * product.quantity}`
                    })),
                },
                outro: 'Looking forward to do more business'
            }
        };

        
          
        let mail = Mailgenerator.generate(response);

        let message = {
            from: ' Flower Style <flowerstyle@gmail.com>',
            to: destinatario,
            subject: `Compra  realizada con éxito`, 
            html: mail
        };
       
        transporter.sendMail(message)
            .then(() => {
                return res.status(200).json({ message: 'You have received an email' });
            })
            
            .catch(err => res.status(500).json({ err: err.message }));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', error: error.message });
    }
};



export const checkoutSms = (req, res) => {
    try {
      
      const newPhoneNumber = req.body.phoneNumber.phoneNumber.value;
      
      if (!newPhoneNumber) {
        throw new Error('Número de teléfono no proporcionado');
      }
   
      const accountSid = config.checkout.checkoutSmsSid;
      const authToken = config.checkout.checkoutSmsToken;
  
      const client = twilio(accountSid, authToken);
  
      client.messages
        .create({
          body: 'Su compra ha sido exitosa, pronto estarán llegando sus productos',
          from: config.checkout.checkoutNumero,
          to: newPhoneNumber,
        })
        .then((message) => {
          console.log('Mensaje enviado con éxito:', message.sid);
          res.status(200).json({ status: 'success', message: 'Mensaje enviado con éxito' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Error al enviar el mensaje' });
        });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Error en la solicitud' });
    }
  };