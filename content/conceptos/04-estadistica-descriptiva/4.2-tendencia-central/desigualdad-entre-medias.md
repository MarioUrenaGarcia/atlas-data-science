---
id: desigualdad-entre-medias
titulo: Desigualdad entre medias
titulo_en: Inequality of means
alias:
  - desigualdad de las medias aritmética y geométrica
  - desigualdad MA-MG
  - AM-GM
modulo: 4
submodulo: '4.2'
orden: 5
nivel: basico
prerrequisitos:
  - media-geometrica
  - media-armonica
etiquetas:
  - desigualdad
  - media aritmética
  - media geométrica
  - media armónica
  - media cuadrática
resumen: >
  Para valores positivos, la media armónica no supera a la geométrica, esta no supera a la aritmética
  y esta no supera a la cuadrática; todas coinciden solo cuando los valores son iguales.
formula: '\bar{x}_H \le \bar{x}_G \le \bar{x} \le \bar{x}_Q'
visualizacion:
  componente: DataStrip
  parametros:
    modo: semicirculo
    a: 3
    b: 12
    variable: Dos valores positivos sobre un diámetro de longitud a + b
referencias:
  - clave: boyd
    capitulo: '3'
  - clave: degroot
publicado: true
---

## Intuición

Un terreno rectangular de 3 por 12 metros tiene 36 m² y un perímetro de 30 m. Un terreno cuadrado con el mismo perímetro mediría 7.5 por 7.5 y tendría 56.25 m²; uno cuadrado con la misma área mediría 6 por 6 y necesitaría solo 24 m de cerca. El lado del cuadrado del mismo perímetro es la media aritmética de 3 y 12; el del cuadrado de la misma área, la media geométrica. Que el cuadrado sea la figura más "eficiente" es lo mismo que decir que la media geométrica nunca supera a la aritmética.

Las cuatro medias clásicas resumen dos o más números positivos de maneras distintas, y siempre aparecen en el mismo orden: armónica, geométrica, aritmética, cuadrática. Cuanto más dispersos están los valores, más se separan; si todos son iguales, las cuatro coinciden. La desigualdad es una herramienta para acotar cantidades y explica errores frecuentes, como sobrestimar el rendimiento de una inversión al promediar sus tasas.

## Definición

:::teorema[Desigualdad entre medias]
Para valores $x_1, \dots, x_n > 0$,
$$
\bar{x}_H \le \bar{x}_G \le \bar{x} \le \bar{x}_Q,
$$
donde
$$
\bar{x}_H = \frac{n}{\sum 1/x_i}, \quad \bar{x}_G = \Big(\prod x_i\Big)^{1/n}, \quad \bar{x} = \frac{1}{n}\sum x_i, \quad \bar{x}_Q = \sqrt{\frac{1}{n}\sum x_i^2}.
$$
Cada igualdad se cumple si y solo si $x_1 = x_2 = \dots = x_n$.
:::

Las cuatro son casos de la media de potencia $M_p = \left(\frac{1}{n}\sum x_i^p\right)^{1/p}$, con $p = -1, 0, 1, 2$ (para $p = 0$ se toma el límite, que es la media geométrica). La media de potencia es creciente en $p$.

:::figura[Las cuatro medias de cinco precios de un mismo producto en distintas tiendas (3, 5, 8, 12 y 20 pesos), en el orden armónica, geométrica, aritmética y cuadrática.]{componente="DataStrip"}
```yaml
modo: centro
datos: [3, 5, 8, 12, 20]
medidas: [armonica, geometrica, media, cuadratica]
variable: Precio
unidad: pesos
decimales: 0
dominio: [0, 24]
```
:::

:::nota[Qué significa cada símbolo]
- $x_i$: valores positivos, $i = 1, \dots, n$.
- $n$: número de valores.
- $\bar{x}_H$: media armónica.
- $\bar{x}_G$: media geométrica.
- $\bar{x}$: media aritmética.
- $\bar{x}_Q$: media cuadrática o raíz de la media de los cuadrados.
- $M_p$: media de potencia de orden $p$.
- $p$: exponente que define la media; $p = -1, 0, 1, 2$ dan las cuatro medias.
:::

## Cómo usar la visualización

Los valores $a$ y $b$ son los dos tramos del diámetro de un semicírculo. La reproducción construye una media por paso y el encabezado muestra su cálculo: la aritmética es el radio; la geométrica, la altura del semicírculo sobre el punto de corte; la armónica, la proyección de esa altura sobre el radio; la cuadrática, la distancia del punto de corte a la cima del semicírculo.

Al final, el orden de las cuatro longitudes es visible: cada segmento es un cateto o una hipotenusa de un triángulo rectángulo que contiene al anterior. Al mover $a$ hacia $b$, el punto de corte se acerca al centro y los cuatro segmentos se confunden en uno; al separar mucho $a$ y $b$, la armónica se encoge y la cuadrática crece.

## Ejemplo

Para $a = 2$ y $b = 8$:

1. Armónica: $\bar{x}_H = \dfrac{2 \cdot 2 \cdot 8}{2 + 8} = \dfrac{32}{10} = 3.2$.
2. Geométrica: $\bar{x}_G = \sqrt{2 \cdot 8} = \sqrt{16} = 4$.
3. Aritmética: $\bar{x} = (2 + 8)/2 = 5$.
4. Cuadrática: $\bar{x}_Q = \sqrt{(4 + 64)/2} = \sqrt{34} \approx 5.83$.
5. Se cumple $3.2 \le 4 \le 5 \le 5.83$. Además, para dos valores, $\bar{x}_G^{\,2} = \bar{x}_H \cdot \bar{x}$: $16 = 3.2 \cdot 5$.

:::figura[El ejemplo con a = 2 y b = 8 en el semicírculo.]{componente="DataStrip"}
```yaml
modo: semicirculo
a: 2
b: 8
```
:::

## Propiedades

- **Igualdad solo con valores iguales.** La diferencia $\bar{x} - \bar{x}_G$ mide, en cierto sentido, la dispersión de los datos.
- **Dos valores:** $\bar{x} - \bar{x}_G = \dfrac{(\sqrt{a} - \sqrt{b})^2}{2}$ y $\bar{x}_G^{\,2} = \bar{x}_H\,\bar{x}$.
- **Cuadrática y varianza:** $\bar{x}_Q^{\,2} - \bar{x}^{\,2} = \frac{1}{n}\sum (x_i - \bar{x})^2$, la varianza con denominador $n$; por eso $\bar{x} \le \bar{x}_Q$.
- **Optimización:** entre todos los rectángulos de perímetro fijo, el cuadrado tiene la mayor área; entre los de área fija, el menor perímetro.

:::demostracion
Aritmética y geométrica para dos valores: $(\sqrt{a} - \sqrt{b})^2 \ge 0$ da $a + b \ge 2\sqrt{ab}$, es decir $\bar{x} \ge \bar{x}_G$, con igualdad si y solo si $a = b$. Geométrica y armónica: aplicando lo anterior a $1/a$ y $1/b$ se obtiene $\frac{1}{2}\left(\frac{1}{a} + \frac{1}{b}\right) \ge \frac{1}{\sqrt{ab}}$, y al invertir, $\bar{x}_H \le \bar{x}_G$. Aritmética y cuadrática: $\bar{x}_Q^{\,2} - \bar{x}^{\,2}$ es una varianza y no puede ser negativa.
:::

:::figura[Caso de igualdad: con a = b = 5, el punto de corte coincide con el centro y las cuatro medias valen 5.]{componente="DataStrip"}
```yaml
modo: semicirculo
a: 5
b: 5
```
:::

## Errores comunes

- **Aplicarla con valores negativos o cero.** La desigualdad requiere valores positivos; con valores no positivos la media geométrica y la armónica pueden no estar definidas.
- **Creer que el orden depende de los datos.** Para valores positivos el orden siempre es el mismo; lo único que cambia es la separación entre las medias.
- **Confundir la desigualdad con una regla para elegir la media.** Que la aritmética sea mayor no la hace mejor ni peor: cada media responde a una pregunta distinta (suma total, producto total, razón con numerador fijo).

:::figura[Error con valores negativos: temperaturas de -4, 2 y 6 grados. La media aritmética existe, pero la geométrica y la armónica no están definidas y el panel las reporta así.]{componente="DataStrip"}
```yaml
modo: centro
datos: [-4, 2, 6]
medidas: [media, geometrica, armonica]
variable: Temperatura mínima
unidad: °C
decimales: 0
dominio: [-6, 8]
```
:::

## Conexiones

La desigualdad ordena la [[media-armonica]], la [[media-geometrica]] y la [[media-aritmetica]], y la diferencia entre la cuadrática y la aritmética es la base de la varianza. Es un caso particular de la desigualdad de Jensen para la función logaritmo, que es cóncava; en general, para una [[funciones-convexas-y-concavas|función cóncava]] el valor en el promedio supera al promedio de los valores. La media de potencia conecta las cuatro medias en una sola familia.

## Formulario

:::formula[Cadena de desigualdades]
$$
\frac{n}{\sum_{i=1}^{n} 1/x_i} \le \Big(\prod_{i=1}^{n} x_i\Big)^{1/n} \le \frac{1}{n}\sum_{i=1}^{n} x_i \le \sqrt{\frac{1}{n}\sum_{i=1}^{n} x_i^2}
$$

- $x_i > 0$: valores.
- $n$: número de valores.
- De izquierda a derecha: medias armónica, geométrica, aritmética y cuadrática.
:::

:::formula[Media de potencia]
$$
M_p = \left(\frac{1}{n}\sum_{i=1}^{n} x_i^p\right)^{1/p}
$$

- $p$: orden; $M_{-1}$ armónica, $M_0$ geométrica (como límite), $M_1$ aritmética, $M_2$ cuadrática.
:::

:::formula[Brecha entre aritmética y geométrica para dos valores]
$$
\frac{a + b}{2} - \sqrt{ab} = \frac{(\sqrt{a} - \sqrt{b})^2}{2}
$$

- $a, b > 0$: los dos valores.
:::

:::formula[Cuadrática y varianza]
$$
\bar{x}_Q^{\,2} - \bar{x}^{\,2} = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2
$$

- $\bar{x}_Q$: media cuadrática; $\bar{x}$: media aritmética.
- El lado derecho es la varianza con denominador $n$.
:::
