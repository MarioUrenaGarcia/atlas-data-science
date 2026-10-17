---
id: divergencia-de-jensen-shannon
titulo: Divergencia de Jensen-Shannon
titulo_en: Jensen-Shannon divergence
alias:
  - JS
  - divergencia JS
  - radio de información
modulo: 0
submodulo: '0.8'
orden: 9
nivel: intermedio
prerrequisitos:
  - divergencia-de-kullback-leibler
etiquetas:
  - divergencia
  - simetría
  - comparación de distribuciones
  - teoría de la información
resumen: >
  La divergencia de Jensen-Shannon compara p y q con su promedio m = (p + q)/2. Es simétrica, siempre
  finita, está entre 0 y 1 bit y su raíz cuadrada es una métrica.
formula: '\mathrm{JS}(p, q) = \tfrac{1}{2} D_{\mathrm{KL}}(p \,\|\, m) + \tfrac{1}{2} D_{\mathrm{KL}}(q \,\|\, m), \qquad m = \tfrac{1}{2}(p + q)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: divergencia
    p: [0.6, 0.3, 0.1]
    q: [0.2, 0.3, 0.5]
    enfoque: jensen-shannon
    etiquetas: [positiva, neutra, negativa]
referencias:
  - clave: cover-thomas
  - clave: murphy
publicado: true
---

## Intuición

Dos encuestas clasifican opiniones como positivas, neutras o negativas, y se quiere un número que diga cuánto difieren, sin decidir cuál de las dos es la referencia. La divergencia de Kullback-Leibler obliga a elegir un sentido y puede ser infinita si una encuesta registra una categoría que la otra no. La divergencia de Jensen-Shannon resuelve las dos cosas con un árbitro neutral: el promedio $m$ de las dos distribuciones.

Se mide cuánto se aleja cada distribución del promedio y se promedian esas dos divergencias. Como $m$ tiene probabilidad positiva en todo lugar donde alguna de las dos la tiene, ninguna divergencia hacia $m$ es infinita. El resultado es simétrico, vale cero solo si las distribuciones coinciden y nunca pasa de 1 bit, valor que alcanza cuando las dos distribuciones no comparten ningún valor.

También tiene una lectura como información mutua: es lo que una observación de la mezcla revela sobre de cuál de las dos distribuciones vino.

## Definición

:::definicion[Divergencia de Jensen-Shannon]
Sean $p$ y $q$ funciones de masa sobre $\mathcal{X}$ y $m = \tfrac{1}{2}(p + q)$. La divergencia de Jensen-Shannon es
$$
\mathrm{JS}(p, q) = \tfrac{1}{2} D_{\mathrm{KL}}(p \,\|\, m) + \tfrac{1}{2} D_{\mathrm{KL}}(q \,\|\, m) = H(m) - \tfrac{1}{2}H(p) - \tfrac{1}{2}H(q).
$$
:::

Si $Z$ es una moneda justa que elige entre $p$ y $q$ y $X$ se extrae de la distribución elegida, entonces $\mathrm{JS}(p, q) = I(X; Z)$.

:::nota[Qué significa cada símbolo]
- $p$, $q$: distribuciones que se comparan.
- $m$: promedio de las dos, también una distribución.
- $\mathrm{JS}(p, q)$: divergencia de Jensen-Shannon en bits.
- $D_{\mathrm{KL}}$: divergencia de Kullback-Leibler.
- $H$: entropía.
- $Z$: variable que indica de cuál distribución sale la observación.
- $X$: observación; $I(X; Z)$: información mutua.
:::

## Cómo usar la visualización

Para cada categoría se dibujan tres barras: $p$, $q$ y, como contorno, el promedio $m$. El encabezado escribe la definición con su valor. La reproducción lleva $q$ hacia $p$; las lecturas muestran al mismo tiempo las dos divergencias de Kullback-Leibler y la entropía cruzada.

Al inicio, $\mathrm{JS} = 0.180$ bits, mientras $D_{\mathrm{KL}}(p \,\|\, q) = 0.719$ y $D_{\mathrm{KL}}(q \,\|\, p) = 0.844$: la divergencia de Jensen-Shannon es mucho menor y no depende del orden. Al avanzar, el contorno de $m$ queda entre las dos barras y las tres convergen; la divergencia llega a cero.

## Ejemplo

Un sensor de temperatura registra lecturas bajas, medias o altas. En invierno sus frecuencias son $p = (0.8, 0.2, 0)$ y en verano $q = (0, 0.2, 0.8)$.

1. Promedio: $m = (0.4, 0.2, 0.4)$.
2. $D_{\mathrm{KL}}(p \,\|\, m) = 0.8 \log_2 \frac{0.8}{0.4} + 0.2 \log_2 \frac{0.2}{0.2} = 0.8$ bits.
3. Por simetría, $D_{\mathrm{KL}}(q \,\|\, m) = 0.8$ bits.
4. $\mathrm{JS}(p, q) = \tfrac{1}{2} \cdot 0.8 + \tfrac{1}{2} \cdot 0.8 = 0.8$ bits.

En cambio, $D_{\mathrm{KL}}(p \,\|\, q)$ es infinita, porque $q$ da probabilidad cero a las lecturas bajas que $p$ produce.

:::figura[Invierno contra verano: la divergencia de Jensen-Shannon vale 0.8 bits mientras las dos divergencias de Kullback-Leibler marcan infinito; la animación las vuelve finitas en cuanto los soportes se traslapan.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [0.8, 0.2, 0]
q: [0, 0.2, 0.8]
enfoque: jensen-shannon
etiquetas: [baja, media, alta]
```
:::

## Propiedades

- **Simetría:** $\mathrm{JS}(p, q) = \mathrm{JS}(q, p)$.
- **Cotas:** $0 \le \mathrm{JS}(p, q) \le 1$ bit (o $\log 2$ nats), con el máximo cuando $p$ y $q$ tienen soportes disjuntos.

:::figura[Dos distribuciones concentradas en valores distintos, sin nada en común: la divergencia alcanza su máximo, exactamente 1 bit.]{componente="InformationViz"}
```yaml
modo: divergencia
p: [1, 0, 0]
q: [0, 0, 1]
enfoque: jensen-shannon
etiquetas: [a, b, c]
```
:::

- **Siempre finita:** como $m \ge p/2$ y $m \ge q/2$, cada término es a lo más $\log_2 2 = 1$.
- **Métrica:** $\sqrt{\mathrm{JS}(p, q)}$ cumple la desigualdad del triángulo y es una distancia entre distribuciones.
- **Generalización:** para $k$ distribuciones con pesos $\pi_i$, $\mathrm{JS}_\pi = H\big(\sum_i \pi_i p_i\big) - \sum_i \pi_i H(p_i)$.

## Errores comunes

- **Usar la divergencia en sí como distancia.** $\mathrm{JS}$ no cumple el triángulo; la métrica es su raíz cuadrada.
- **Esperar que distinga soportes disjuntos según su lejanía.** Con soportes disjuntos vale 1 bit sin importar si los valores están juntos o separados; para eso se usa la [[distancia-de-wasserstein-y-transporte-optimo]].
- **Comparar valores en bits con valores en nats.** El máximo es 1 en bits y $0.693$ en nats.
- **Pensar que es el promedio de las dos divergencias de Kullback-Leibler entre $p$ y $q$.** Esa cantidad es la divergencia de Jeffreys, que puede ser infinita; la de Jensen-Shannon compara cada una con la mezcla.

## Conexiones

Se construye con dos [[divergencia-de-kullback-leibler|divergencias de Kullback-Leibler]] hacia la mezcla, evitando la elección de sentido que analiza la [[asimetria-de-la-divergencia-kl]]. Se escribe con entropías de Shannon, como en [[entropia-de-shannon]], y es una [[informacion-mutua]] entre la observación y su origen. Pertenece a la familia de las [[divergencias-f]].

## Formulario

:::formula[Jensen-Shannon]
$$
\mathrm{JS}(p, q) = \tfrac{1}{2}D_{\mathrm{KL}}(p \,\|\, m) + \tfrac{1}{2}D_{\mathrm{KL}}(q \,\|\, m), \qquad m = \tfrac{1}{2}(p + q)
$$

- $p$, $q$: distribuciones comparadas; $m$: su promedio; $D_{\mathrm{KL}}$: divergencia de Kullback-Leibler.
:::

:::formula[Forma con entropías]
$$
\mathrm{JS}(p, q) = H(m) - \tfrac{1}{2}H(p) - \tfrac{1}{2}H(q)
$$

- $H(m)$, $H(p)$, $H(q)$: entropías de la mezcla y de cada distribución.
:::

:::formula[Cotas]
$$
0 \le \mathrm{JS}(p, q) \le 1\ \text{bit}
$$

- El máximo se alcanza solo con soportes disjuntos.
:::

:::formula[Distancia de Jensen-Shannon]
$$
d_{\mathrm{JS}}(p, q) = \sqrt{\mathrm{JS}(p, q)}
$$

- $d_{\mathrm{JS}}$: distancia que cumple la desigualdad del triángulo.
:::
