---
id: muestreo-con-y-sin-reemplazo
titulo: Muestreo con y sin reemplazo
titulo_en: Sampling with and without replacement
alias:
  - muestreo con reposición
  - muestreo sin reposición
modulo: 5
submodulo: '5.1'
orden: 3
nivel: basico
prerrequisitos:
  - muestreo-aleatorio-simple
  - distribucion-hipergeometrica
relaciones:
  - tipo: contrasta
    id: distribucion-binomial
etiquetas:
  - reposición
  - población finita
  - independencia
  - varianza del estimador
resumen: >
  Con reemplazo cada unidad extraída se devuelve y puede volver a salir; sin reemplazo cada unidad
  sale a lo sumo una vez. Sin reemplazo la media muestral es más precisa por el factor 1 - n/N.
formula: '\operatorname{Var}_{\mathrm{con}}(\bar{y}) = \frac{\sigma^2}{n}, \qquad \operatorname{Var}_{\mathrm{sin}}(\bar{y}) = \frac{N-n}{N-1}\,\frac{\sigma^2}{n}'
visualizacion:
  componente: SurveySampler
  parametros:
    diseno: mas
    reemplazo: true
    n: 24
    nMaximo: 48
    repeticiones: 400
    poblacion:
      columnas: 8
      filas: 6
      estratos:
        - nombre: Lote
          media: 410
      desviacion: 35
      icc: 0
      decimales: 0
      variable: Duración de la batería
      unidad: h
      nombreUnidad: Batería
referencias:
  - clave: lohr
    capitulo: '2'
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Un inspector toma pilas de un lote de 48 para medir cuántas horas duran. Si después de medir cada pila la regresa a la caja antes de sacar la siguiente, la misma pila puede volver a salir; si la aparta, cada extracción revela una pila nueva. En el primer caso se dice que el muestreo es **con reemplazo**; en el segundo, **sin reemplazo**.

Con reemplazo, las extracciones son independientes y todas tienen la misma distribución: es la situación que suponen la mayoría de los resultados teóricos. Pero desperdicia información, porque medir dos veces la misma pila no enseña nada nuevo. Sin reemplazo, cada extracción descarta una unidad ya conocida y la siguiente se elige entre las que faltan. Cuando la muestra es una fracción pequeña de la población, la diferencia es despreciable; cuando la muestra es la mitad del lote, sin reemplazo se obtiene una estimación notablemente más precisa, y si se mide todo el lote el error desaparece.

## Definición

:::definicion[Muestreo con y sin reemplazo]
Sea una población finita de $N$ unidades con valores $y_1, \dots, y_N$. En el **muestreo aleatorio con reemplazo** de tamaño $n$, cada una de las $n$ extracciones elige una unidad con probabilidad $1/N$, independientemente de las anteriores; hay $N^n$ secuencias posibles, todas igual de probables. En el **muestreo aleatorio sin reemplazo**, cada extracción elige al azar entre las unidades que aún no han salido; el resultado es un muestreo aleatorio simple y hay $\binom{N}{n}$ muestras posibles.
:::

Con media poblacional $\bar{Y}$ y varianza poblacional $\sigma^2 = \frac{1}{N}\sum_{i=1}^{N}(y_i - \bar{Y})^2$, la media muestral es insesgada en ambos casos y sus varianzas son
$$
\operatorname{Var}_{\mathrm{con}}(\bar{y}) = \frac{\sigma^2}{n}, \qquad \operatorname{Var}_{\mathrm{sin}}(\bar{y}) = \frac{N-n}{N-1}\,\frac{\sigma^2}{n} = \left(1 - \frac{n}{N}\right)\frac{S^2}{n},
$$
donde $S^2 = \frac{N}{N-1}\sigma^2$.

:::nota[Qué significa cada símbolo]
- $N$: tamaño de la población; $n$: número de extracciones.
- $y_i$: valor de la unidad $i$; $\bar{Y}$: media de la población; $\bar{y}$: media de la muestra.
- $\sigma^2$: varianza de la población con denominador $N$; $S^2$: la misma con denominador $N - 1$.
- $N^n$: secuencias posibles con reemplazo; $\binom{N}{n}$: muestras posibles sin reemplazo.
- $\frac{N-n}{N-1}$: cociente entre ambas varianzas.
:::

## Cómo usar la visualización

Los 48 puntos son las baterías del lote; el tono indica su duración. Con el interruptor "Con reemplazo" encendido, una batería puede salir varias veces y aparece con un número que indica cuántas. Abajo se acumulan las medias de 400 muestras de 24 extracciones.

Experimentos sugeridos:

- Compara el error estándar teórico con y sin reemplazo: al apagar el interruptor baja de unos 8.8 a unos 6.3 horas, un 29 % menos.
- Sube $n$ a 48 sin reemplazo: todas las muestras son el lote completo y el histograma se reduce a una sola barra.
- Con reemplazo y $n = 48$, observa que el histograma sigue teniendo dispersión: repetir no equivale a medir todo.

## Ejemplo

El lote tiene $N = 48$ baterías con desviación estándar poblacional $\sigma = 35$ horas, y se extraen $n = 12$.

1. Con reemplazo: $\operatorname{Var}(\bar{y}) = 35^2/12 = 102.1$, error estándar $10.1$ horas.
2. Sin reemplazo: el factor es $(48-12)/(48-1) = 0.766$, así que la varianza es $0.766 \cdot 102.1 = 78.2$ y el error estándar $8.8$ horas.
3. Probabilidad de que una muestra con reemplazo no repita ninguna batería: $\frac{48 \cdot 47 \cdots 37}{48^{12}} \approx 0.22$. En casi cuatro de cada cinco muestras alguna batería se mide dos veces.

:::figura[Una muestra de 12 extracciones con reemplazo: las baterías marcadas con un número salieron más de una vez y cuentan dos veces en la media.]{componente="SurveySampler"}
```yaml
diseno: mas
reemplazo: true
n: 12
nMaximo: 48
repeticiones: 1
semilla: 21
poblacion:
  columnas: 8
  filas: 6
  estratos:
    - nombre: Lote
      media: 410
  desviacion: 35
  icc: 0
  decimales: 0
  variable: Duración de la batería
  unidad: h
  nombreUnidad: Batería
```
:::

## Propiedades

- **Ambos diseños son insesgados** para la media: $\mathbb{E}[\bar{y}] = \bar{Y}$.
- **Sin reemplazo es más preciso:** el cociente de varianzas $\frac{N-n}{N-1}$ es menor que 1 si $n > 1$, y vale 0 cuando $n = N$.
- **Con muestras pequeñas la diferencia desaparece:** si $n/N$ es pequeño, $\frac{N-n}{N-1} \approx 1$ y las extracciones sin reemplazo son casi independientes.
- **Conteos:** el número de éxitos en $n$ extracciones de una población con $K$ éxitos sigue una distribución binomial con reemplazo y una hipergeométrica sin reemplazo; la hipergeométrica tiene la misma media $nK/N$ y una varianza menor por el mismo factor $\frac{N-n}{N-1}$.

:::figura[Propiedad de precisión: el mismo lote muestreado sin reemplazo con 24 extracciones. El histograma es más angosto que el de la visualización principal, que usa reemplazo.]{componente="SurveySampler"}
```yaml
diseno: mas
reemplazo: false
n: 24
nMaximo: 48
semilla: 665781
repeticiones: 400
poblacion:
  columnas: 8
  filas: 6
  estratos:
    - nombre: Lote
      media: 410
  desviacion: 35
  icc: 0
  decimales: 0
  variable: Duración de la batería
  unidad: h
  nombreUnidad: Batería
```
:::

:::figura[Propiedad de poblaciones grandes: en una población de 600 hogares, 20 extracciones con o sin reemplazo producen histogramas casi iguales. Usa el interruptor para comparar.]{componente="SurveySampler"}
```yaml
diseno: mas
reemplazo: true
n: 20
repeticiones: 400
poblacion:
  columnas: 30
  filas: 20
  estratos:
    - nombre: Municipio
      media: 6.5
  desviacion: 1.8
  icc: 0
  decimales: 1
  variable: Consumo diario de agua
  unidad: m³
  nombreUnidad: Hogar
```
:::

## Errores comunes

- **Creer que con reemplazo y $n = N$ se obtiene un censo.** Con reemplazo, $N$ extracciones dejan fuera en promedio a un 37 % de las unidades, porque $(1 - 1/N)^N \approx e^{-1}$.
- **Aplicar fórmulas de independencia a muestras grandes sin reemplazo.** Si se usa $\sigma^2/n$ cuando $n/N$ es grande, el error estándar reportado es mayor que el real y los intervalos son demasiado anchos.
- **Pensar que sin reemplazo las extracciones son independientes.** Cada unidad que sale cambia la composición de lo que queda; por eso la hipergeométrica no es una binomial.

:::figura[Error de confundir n = N con un censo: 48 extracciones con reemplazo de un lote de 48 todavía producen estimaciones dispersas, porque muchas baterías nunca salen.]{componente="SurveySampler"}
```yaml
diseno: mas
reemplazo: true
n: 48
nMaximo: 48
repeticiones: 400
poblacion:
  columnas: 8
  filas: 6
  estratos:
    - nombre: Lote
      media: 410
  desviacion: 35
  icc: 0
  decimales: 0
  variable: Duración de la batería
  unidad: h
  nombreUnidad: Batería
```
:::

:::figura[Error de ignorar la falta de independencia: 40 de 48 baterías sin reemplazo. El error estándar real es menos de la mitad del que daría la fórmula para extracciones independientes.]{componente="SurveySampler"}
```yaml
diseno: mas
reemplazo: false
n: 40
nMaximo: 48
repeticiones: 400
poblacion:
  columnas: 8
  filas: 6
  estratos:
    - nombre: Lote
      media: 410
  desviacion: 35
  icc: 0
  decimales: 0
  variable: Duración de la batería
  unidad: h
  nombreUnidad: Batería
```
:::

## Conexiones

El muestreo sin reemplazo es el [[muestreo-aleatorio-simple]]. La diferencia entre ambos esquemas es la diferencia entre la [[distribucion-binomial]] y la [[distribucion-hipergeometrica]], y el cociente de varianzas da lugar al factor de corrección por población finita. Con reemplazo, las extracciones son independientes e idénticamente distribuidas, la situación en la que se enuncian la [[ley-debil-de-los-grandes-numeros]] y el [[teorema-central-del-limite]].

## Formulario

:::formula[Varianza con reemplazo]
$$
\operatorname{Var}_{\mathrm{con}}(\bar{y}) = \frac{\sigma^2}{n}, \qquad \sigma^2 = \frac{1}{N}\sum_{i=1}^{N}(y_i - \bar{Y})^2
$$

- $\sigma^2$: varianza de la población con denominador $N$.
- $n$: número de extracciones.
:::

:::formula[Varianza sin reemplazo]
$$
\operatorname{Var}_{\mathrm{sin}}(\bar{y}) = \frac{N-n}{N-1}\,\frac{\sigma^2}{n} = \left(1 - \frac{n}{N}\right)\frac{S^2}{n}
$$

- $N$: tamaño de la población.
- $S^2 = \frac{N}{N-1}\sigma^2$: varianza con denominador $N - 1$.
:::

:::formula[Probabilidad de no repetir con reemplazo]
$$
P(\text{sin repeticiones}) = \frac{N(N-1)\cdots(N-n+1)}{N^n}
$$

- Numerador: secuencias de $n$ unidades distintas; denominador: todas las secuencias.
:::

:::formula[Fracción no observada con n = N extracciones]
$$
P(\text{una unidad nunca sale}) = \left(1 - \frac{1}{N}\right)^N \approx e^{-1} \approx 0.37
$$

- $1 - 1/N$: probabilidad de que una extracción no elija a esa unidad.
:::
