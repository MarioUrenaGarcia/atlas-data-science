---
id: metodo-de-aceptacion-y-rechazo
titulo: Método de aceptación y rechazo
titulo_en: Rejection sampling
alias:
  - muestreo por rechazo
  - método de rechazo de von Neumann
  - aceptación-rechazo
modulo: 2
submodulo: '2.5'
orden: 8
nivel: intermedio
prerrequisitos:
  - generadores-de-numeros-pseudoaleatorios
  - distribucion-geometrica
relaciones:
  - tipo: generaliza
    id: metodo-polar-de-marsaglia
etiquetas:
  - simulación
  - envolvente
  - muestreo
  - densidad objetivo
  - eficiencia
resumen: >
  Para muestrear de una densidad f, se proponen valores de una densidad g fácil de simular y se aceptan
  con probabilidad f(x)/(M g(x)). Los aceptados siguen exactamente a f y se acepta una fracción 1/M.
formula: '\text{aceptar } X \sim g \text{ si } U \le \frac{f(X)}{M\,g(X)}, \qquad f \le M g, \qquad P(\text{aceptar}) = \frac{1}{M}'
visualizacion:
  componente: RandomLab
  parametros:
    modo: aceptacion-rechazo
    objetivo: beta
    valores:
      holgura: 1
    casos:
      - nombre: 'Envolvente justa'
        descripcion: 'M igual a la mínima, 2.06: se acepta el 48.6 % de las propuestas y el histograma sigue a la beta.'
        valores: {holgura: 1}
      - nombre: 'Envolvente holgada'
        descripcion: 'M al doble de la mínima: las muestras siguen siendo correctas, pero se acepta solo el 24 %.'
        valores: {holgura: 2}
      - nombre: 'Envolvente demasiado baja'
        descripcion: 'M al 70 % de la mínima: la envolvente corta a la densidad cerca de su máximo y el histograma queda aplanado ahí.'
        valores: {holgura: 0.7}
referencias:
  - clave: ross-procesos
  - clave: bishop
  - clave: gelman-bda
publicado: true
---

## Intuición

Se quiere simular el tiempo que tarda un componente en una prueba, cuya distribución tiene una densidad conocida pero sin una inversa manejable. Una idea, propuesta por von Neumann, es lanzar dardos al azar bajo una curva fácil que cubra por completo a la densidad deseada, y quedarse solo con los dardos que caen bajo la densidad. Las posiciones horizontales de los dardos aceptados siguen exactamente a la densidad, porque en cada lugar sobreviven en proporción a la altura de la curva.

En la práctica, la curva fácil es una densidad $g$ de la que sí se sabe simular, multiplicada por una constante $M$ suficiente para quedar siempre por encima del objetivo $f$. Se sortea un valor de $g$ y una altura al azar entre cero y $M g$ en ese valor; si la altura queda bajo $f$, se acepta.

La eficiencia depende de qué tan ajustada está la envolvente: la fracción aceptada es $1/M$. Una envolvente holgada desperdicia propuestas; una que no cubre a $f$ en algún punto produce muestras sesgadas, porque recorta la densidad justo donde es más alta.

## Definición

:::definicion[Método de aceptación y rechazo]
Sea $f$ la densidad objetivo y $g$ una densidad de propuesta con $f(x) \le M\,g(x)$ para todo $x$, donde $M \ge 1$ es constante. Se repite:

1. Sortear $X \sim g$ y $U \sim \mathcal{U}(0, 1)$ independientes.
2. Si $U \le \frac{f(X)}{M\,g(X)}$, aceptar y devolver $X$; si no, volver al paso 1.

El valor devuelto tiene densidad $f$, y cada propuesta se acepta con probabilidad $1/M$.
:::

:::nota[Qué es X]
$X$ = el valor aceptado, que sigue la densidad objetivo $f$; por ejemplo, una proporción con distribución beta.
:::

:::nota[Qué hace cada parámetro]
- **$M$, constante de la envolvente:** cuánto se eleva $g$ para cubrir a $f$. Si aumenta por encima del mínimo, las muestras siguen siendo correctas pero se aceptan menos; si baja del mínimo, las muestras quedan sesgadas.
- **$g$, propuesta:** la densidad de la que se sortea. Si se parece más a $f$, la $M$ mínima se acerca a 1 y casi todo se acepta.
:::

:::nota[Qué significa cada símbolo]
- $f$: densidad objetivo; $g$: densidad de propuesta; $M$: constante tal que $f \le Mg$.
- $X$: valor propuesto; $U$: uniforme para la decisión.
- $\frac{f(X)}{M g(X)}$: probabilidad de aceptar el valor $X$.
- $M^{*} = \sup_x f(x)/g(x)$: la constante mínima.
:::

## Cómo usar la visualización

La curva continua es la densidad objetivo $f$ y la punteada la envolvente $M g$. Cada propuesta es un punto $(x, u M g(x))$: se acepta si queda bajo $f$ y se rechaza si queda entre $f$ y la envolvente, con colores distintos. El histograma claro acumula los valores aceptados. El control fija $M$ como múltiplo de la mínima; el panel compara la tasa de aceptación con $1/M$ e indica si la envolvente cubre a $f$. Los casos cargan una envolvente justa, una holgada y una demasiado baja.

Con la envolvente justa agrega 2000 propuestas y observa que el histograma sigue a la beta. Duplica $M$ y observa que la tasa cae a la mitad. Baja $M$ a 0.7 de la mínima y observa que el histograma se aplana cerca del máximo.

## Ejemplo

Se muestrea de $f = \operatorname{Beta}(2.5, 4)$ con propuestas uniformes en $[0, 1]$, $g(x) = 1$.

1. La moda de la beta es $\frac{2.5 - 1}{2.5 + 4 - 2} = \frac{1}{3}$ y su densidad máxima es $f(1/3) \approx 2.058$; así que $M^{*} = 2.058$.
2. Tasa de aceptación: $1/M^{*} \approx 0.486$; en promedio hacen falta 2.06 propuestas por muestra.
3. Propuesta $x = 0.2$ con $u = 0.7$: altura $0.7 \cdot 2.058 = 1.441$ frente a $f(0.2) \approx 1.653$; se acepta.
4. Propuesta $x = 0.7$ con $u = 0.4$: altura $0.4 \cdot 2.058 = 0.823$ frente a $f(0.7) \approx 0.571$; se rechaza.
5. Con $M = 4.12$, el doble, las muestras siguen siendo beta, pero la tasa baja a 0.243.

:::figura[Envolvente justa: con M = 2.058 la envolvente toca a la beta en su moda; los puntos bajo la curva se aceptan y su histograma sigue a la densidad.]{componente="RandomLab"}
```yaml
modo: aceptacion-rechazo
objetivo: beta
valores:
  holgura: 1
```
:::

## Propiedades

- **Exactitud:** si $f \le Mg$, los valores aceptados tienen densidad exactamente $f$.
- **Eficiencia:** el número de propuestas por muestra es geométrico con media $M$; conviene la $M$ mínima $M^{*} = \sup_x f(x)/g(x)$.
- **Densidades sin normalizar:** basta conocer $f$ hasta una constante; con $\tilde{f} = cf$ se usa $\tilde{f} \le \tilde{M}g$ y la tasa es $c/\tilde{M}$.
- **Elección de la propuesta:** $g$ debe tener colas al menos tan pesadas como las de $f$; si no, $f/g$ no está acotada y no existe $M$.
- **Dimensión:** en muchas dimensiones $M^{*}$ suele crecer exponencialmente y el método se vuelve impráctico; ahí se usan cadenas de Markov.
- **Casos particulares:** el método polar de Marsaglia es rechazo con el cuadrado como envolvente del círculo, y el ziggurat combina rectángulos con rechazo en los bordes.

:::figura[Casos con contexto (envolvente justa, holgada y demasiado baja): cada botón carga el múltiplo de M y una frase explica el efecto en la tasa y en el histograma.]{componente="RandomLab"}
```yaml
modo: aceptacion-rechazo
objetivo: beta
valores:
  holgura: 2
casos:
  - nombre: 'Envolvente justa'
    descripcion: 'Tasa 0.486.'
    valores: {holgura: 1}
  - nombre: 'Envolvente holgada'
    descripcion: 'Tasa 0.243, muestras correctas.'
    valores: {holgura: 2}
  - nombre: 'Envolvente demasiado baja'
    descripcion: 'Muestras sesgadas cerca de la moda.'
    valores: {holgura: 0.7}
```
:::

:::figura[Mezcla bimodal con propuesta normal: con g = N(0, 2²), la constante mínima es 2.16 y se acepta el 46 %; las dos jorobas aparecen en el histograma.]{componente="RandomLab"}
```yaml
modo: aceptacion-rechazo
objetivo: bimodal
valores:
  holgura: 1
```
:::

:::figura[Normal truncada a [-2, 2] con propuesta uniforme: la constante mínima es 1.67 y se acepta el 60 %.]{componente="RandomLab"}
```yaml
modo: aceptacion-rechazo
objetivo: normal-truncada
valores:
  holgura: 1
```
:::

## Errores comunes

- **Usar una M que no cubre a f.** Si $f > Mg$ en alguna zona, esa zona queda subrepresentada y las muestras no siguen a $f$.
- **Elegir una propuesta con colas más ligeras.** Una normal no sirve como propuesta para una Cauchy: el cociente $f/g$ crece sin límite.
- **Reusar la uniforme de la propuesta para decidir.** $U$ debe ser independiente de $X$.
- **Ignorar el costo.** Con $M = 100$ se descartan 99 de cada 100 propuestas; conviene buscar una $g$ más parecida a $f$.

:::figura[Envolvente demasiado baja: con M al 70 % de la mínima, la línea punteada corta a la beta cerca de su moda y el histograma queda aplanado ahí; el panel lo indica.]{componente="RandomLab"}
```yaml
modo: aceptacion-rechazo
objetivo: beta
valores:
  holgura: 0.7
```
:::

## Conexiones

Parte de [[generadores-de-numeros-pseudoaleatorios]] y de una [[funcion-de-densidad-de-probabilidad]] objetivo, como la [[distribucion-beta]]. El número de propuestas por muestra sigue una [[distribucion-geometrica]]. Casos particulares son el [[metodo-polar-de-marsaglia]] y el [[algoritmo-ziggurat]]. Cuando la transformada inversa es manejable, el [[muestreo-por-transformada-inversa]] es más directo. En estadística bayesiana, la misma idea de proponer y aceptar está detrás de los algoritmos de Metropolis. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Regla de aceptación]
$$
\text{aceptar } X \sim g \iff U \le \frac{f(X)}{M\,g(X)}
$$

- $f$: objetivo; $g$: propuesta; $M$: constante con $f \le Mg$; $U$: uniforme independiente.
:::

:::formula[Constante mínima y eficiencia]
$$
M^{*} = \sup_x \frac{f(x)}{g(x)}, \qquad P(\text{aceptar}) = \frac{1}{M}, \qquad \mathbb{E}[\text{propuestas}] = M
$$

- $\sup$: máximo sobre el soporte.
:::

:::formula[Moda de la beta]
$$
x^{*} = \frac{a - 1}{a + b - 2}, \qquad a, b > 1
$$

- $a$, $b$: parámetros de la beta; con $a = 2.5$ y $b = 4$ vale $1/3$.
:::
