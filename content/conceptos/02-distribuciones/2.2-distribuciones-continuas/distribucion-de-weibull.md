---
id: distribucion-de-weibull
titulo: Distribución de Weibull
titulo_en: Weibull distribution
alias:
  - Weibull
  - distribución del eslabón más débil
modulo: 2
submodulo: '2.2'
orden: 14
nivel: basico
prerrequisitos:
  - distribucion-exponencial
relaciones:
  - tipo: generaliza
    id: distribucion-exponencial
  - tipo: relacionado
    id: distribucion-de-gumbel
etiquetas:
  - distribución continua
  - confiabilidad
  - tasa de falla
  - valores mínimos
resumen: >
  Distribución de tiempos de vida con forma k y escala λ. Con k > 1 la tasa de falla crece (desgaste),
  con k < 1 decrece (fallas tempranas) y con k = 1 es exponencial.
formula: 'F(x) = 1 - e^{-(x/\lambda)^{k}}, \quad x \ge 0'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: weibull
      valores:
        k: 1.5
        lambda: 3
      rangos:
        k: [0.3, 6]
        lambda: [0.3, 8]
      dominio: [0, 10]
      casos:
        - nombre: 'Fallas tempranas'
          descripcion: 'k = 0.7: la densidad decrece desde el cero; las piezas con defectos de fabricación fallan pronto y las que sobreviven se vuelven confiables.'
          valores: {k: 0.7, lambda: 3}
        - nombre: 'Rodamientos'
          descripcion: 'k = 1.5 y λ = 3 años: el riesgo crece con el uso y la vida se concentra entre 1 y 5 años.'
          valores: {k: 1.5, lambda: 3}
        - nombre: 'Desgaste fuerte'
          descripcion: 'k = 4: casi todas las piezas fallan cerca de la escala; la forma se parece a una campana.'
          valores: {k: 4, lambda: 3}
      ejemplo:
        titulo: 'Vida de un rodamiento'
        contexto: 'La vida de un rodamiento, en años, sigue una Weibull con forma 1.5 y escala 3.'
        pregunta: '¿Qué probabilidad hay de que dure más de 2 años?'
        valores: {k: 1.5, lambda: 3}
        region: derecha
        desde: 2
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: minimo
        valores:
          n: 20
          k: 2
referencias:
  - clave: coles
  - clave: ross-probabilidad
    capitulo: '5'
publicado: true
---

## Intuición

Una cadena se rompe por su eslabón más débil. Si una cadena tiene muchos eslabones y la resistencia de cada uno es aleatoria, la resistencia de la cadena completa es el mínimo de todas ellas. Cuando el número de eslabones es grande, ese mínimo, bien reescalado, sigue casi siempre la misma familia de distribuciones: la de Weibull. Lo mismo vale para una pieza que falla cuando cualquiera de sus muchos defectos microscópicos se propaga.

La Weibull es la distribución de referencia en confiabilidad porque su parámetro de forma describe cómo cambia el riesgo con el tiempo. Con forma mayor que 1, la pieza se desgasta: cuanto más tiempo lleva funcionando, más probable es que falle pronto, como un rodamiento o un neumático. Con forma menor que 1, las fallas se concentran al principio y las piezas que sobreviven ese periodo se vuelven más confiables, como ocurre con defectos de fabricación. Con forma igual a 1 el riesgo es constante y se recupera la exponencial.

El parámetro de escala fija el tiempo característico: la probabilidad de sobrevivir más allá de la escala es siempre $e^{-1} \approx 0.37$, sin importar la forma.

## Definición

:::definicion[Distribución de Weibull]
Una variable aleatoria $X \ge 0$ tiene **distribución de Weibull** con forma $k > 0$ y escala $\lambda > 0$, $X \sim \operatorname{Weibull}(k, \lambda)$, si
$$
F(x) = 1 - e^{-(x/\lambda)^{k}}, \qquad f(x) = \frac{k}{\lambda}\left(\frac{x}{\lambda}\right)^{k - 1} e^{-(x/\lambda)^{k}}, \qquad x \ge 0.
$$
:::

Su **tasa de falla** o función de riesgo es $h(x) = \frac{f(x)}{1 - F(x)} = \frac{k}{\lambda}\left(\frac{x}{\lambda}\right)^{k - 1}$, creciente si $k > 1$, constante si $k = 1$ y decreciente si $k < 1$.

:::nota[Qué significa cada símbolo]
- $X$: tiempo de vida o resistencia.
- $k$: forma; controla cómo cambia el riesgo con el tiempo.
- $\lambda$: escala, el tiempo característico.
- $F(x)$: probabilidad de fallar antes de $x$.
- $f(x)$: densidad.
- $h(x)$: tasa de falla instantánea en $x$, dado que se sobrevivió hasta $x$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Weibull, la región elegida y su probabilidad; los casos cargan fallas tempranas, rodamientos y desgaste fuerte, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge toma la resistencia del eslabón más débil de una cadena de 20 y la reescala: su histograma se acerca a la Weibull.

Al mover $k$ por debajo de 1 la densidad se dispara en el cero; con $k = 1$ es exponencial; con $k$ grande se concentra alrededor de $\lambda$. Con cualquier forma, la región desde $\lambda$ tiene probabilidad $e^{-1} \approx 0.37$.

## Ejemplo

La vida de un rodamiento, en años, sigue $\operatorname{Weibull}(1.5, 3)$.

1. Probabilidad de que dure más de 2 años: $P(X > 2) = e^{-(2/3)^{1.5}} = e^{-0.544} \approx 0.580$.
2. Vida mediana: $3(\log 2)^{1/1.5} \approx 2.35$ años.
3. Vida media: $\lambda\,\Gamma(1 + 1/k) = 3\,\Gamma(1.667) \approx 2.71$ años.
4. Tasa de falla a 1 año y a 3 años: $h(1) = 0.5\sqrt{1/3} \approx 0.29$ y $h(3) = 0.5$; el riesgo crece con el uso.

:::figura[Rodamientos Weibull(1.5, 3): el área sombreada a la derecha de 2 años vale 0.580.]{componente="DistributionExplorer"}
```yaml
distribucion: weibull
valores:
  k: 1.5
  lambda: 3
rangos:
  k: [0.3, 6]
  lambda: [0.3, 8]
dominio: [0, 10]
ejemplo:
  titulo: 'Vida de un rodamiento'
  contexto: 'La vida de un rodamiento, en años, sigue una Weibull con forma 1.5 y escala 3.'
  pregunta: '¿Qué probabilidad hay de que dure más de 2 años?'
  valores: {k: 1.5, lambda: 3}
  region: derecha
  desde: 2
region: derecha
desde: 2
muestras: false
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = \lambda\Gamma(1 + 1/k)$ y $\operatorname{Var}(X) = \lambda^{2}\left[\Gamma(1 + 2/k) - \Gamma(1 + 1/k)^{2}\right]$.
- **Escala característica:** $P(X > \lambda) = e^{-1}$ para toda $k$.
- **Caso $k = 1$:** exponencial con tasa $1/\lambda$; caso $k = 2$: distribución de Rayleigh.
- **Transformación de una exponencial:** si $E \sim \operatorname{Exp}(1)$, entonces $\lambda E^{1/k} \sim \operatorname{Weibull}(k, \lambda)$.
- **Mínimos:** el mínimo de $n$ Weibull independientes con la misma forma es Weibull con escala $\lambda n^{-1/k}$; la familia es cerrada bajo mínimos.
- **Límite del eslabón más débil:** el mínimo reescalado de muchas variables con cola inferior de tipo $x^{k}$ converge a una Weibull.

:::figura[Tres casos con contexto (fallas tempranas, rodamientos, desgaste fuerte): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: weibull
valores:
  k: 1.5
  lambda: 3
rangos:
  k: [0.3, 6]
  lambda: [0.3, 8]
dominio: [0, 10]
casos:
  - nombre: 'Fallas tempranas'
    descripcion: 'k = 0.7: la densidad decrece desde el cero; las piezas con defectos de fabricación fallan pronto y las que sobreviven se vuelven confiables.'
    valores: {k: 0.7, lambda: 3}
  - nombre: 'Rodamientos'
    descripcion: 'k = 1.5 y λ = 3 años: el riesgo crece con el uso y la vida se concentra entre 1 y 5 años.'
    valores: {k: 1.5, lambda: 3}
  - nombre: 'Desgaste fuerte'
    descripcion: 'k = 4: casi todas las piezas fallan cerca de la escala; la forma se parece a una campana.'
    valores: {k: 4, lambda: 3}
```
:::

:::figura[Eslabón más débil: cada resultado toma el mínimo de 20 resistencias y lo reescala; el histograma se acerca a la Weibull con forma 2 (línea punteada).]{componente="ContinuousGenesis"}
```yaml
proceso: minimo
valores:
  n: 20
  k: 2
```
:::

:::figura[Tres formas con escala 1: k = 0.7 decrece desde el cero (fallas tempranas), k = 1 es exponencial y k = 3.5 se concentra alrededor de 1 (desgaste).]{componente="DistributionExplorer"}
```yaml
distribucion: weibull
valores:
  k: 3.5
  lambda: 1
dominio: [0, 3]
muestras: false
referencia:
  distribucion: weibull
  valores:
    k: 0.7
    lambda: 1
  etiqueta: Forma 0.7
```
:::

## Errores comunes

- **Usar la exponencial para piezas que se desgastan.** Supone riesgo constante y subestima las fallas tardías.
- **Confundir la escala con la media.** La media es $\lambda\Gamma(1 + 1/k)$; solo coincide con $\lambda$ cuando $k = 1$.
- **Mezclar parametrizaciones.** Algunos textos usan $e^{-x^{k}/\theta}$ con $\theta = \lambda^{k}$; los valores numéricos cambian.
- **Interpretar la forma sin mirar la tasa de falla.** Una forma 1.1 apenas difiere de la exponencial; el desgaste importante aparece con formas claramente mayores que 1.

:::figura[Riesgo creciente frente a constante: Weibull(1.5, 3) (curva) concentra menos masa en vidas muy largas que la exponencial con la misma media, 2.71 años (línea punteada).]{componente="DistributionExplorer"}
```yaml
distribucion: weibull
valores:
  k: 1.5
  lambda: 3
rangos:
  k: [0.3, 6]
  lambda: [0.3, 8]
dominio: [0, 12]
muestras: false
referencia:
  distribucion: exponencial
  valores:
    lambda: 0.369
  etiqueta: Exponencial de media 2.71
```
:::

## Conexiones

La Weibull generaliza la [[distribucion-exponencial]] permitiendo tasas de falla variables, y con forma 2 es la [[distribucion-de-rayleigh]]. Es una de las tres distribuciones límite de los extremos, junto con la [[distribucion-de-gumbel]] y la [[distribucion-de-frechet]]: describe mínimos de variables acotadas inferiormente. Se usa en confiabilidad, análisis de supervivencia, velocidades del viento y resistencia de materiales.

## Formulario

:::formula[Distribución y densidad]
$$
F(x) = 1 - e^{-(x/\lambda)^{k}}, \qquad f(x) = \frac{k}{\lambda}\left(\frac{x}{\lambda}\right)^{k - 1} e^{-(x/\lambda)^{k}}
$$

- $k$: forma.
- $\lambda$: escala.
:::

:::formula[Tasa de falla]
$$
h(x) = \frac{k}{\lambda}\left(\frac{x}{\lambda}\right)^{k - 1}
$$

- Creciente si $k > 1$, constante si $k = 1$, decreciente si $k < 1$.
:::

:::formula[Media, varianza y mediana]
$$
\mathbb{E}[X] = \lambda\Gamma\!\left(1 + \tfrac{1}{k}\right), \qquad \operatorname{Var}(X) = \lambda^{2}\left[\Gamma\!\left(1 + \tfrac{2}{k}\right) - \Gamma\!\left(1 + \tfrac{1}{k}\right)^{2}\right], \qquad \operatorname{mediana} = \lambda(\log 2)^{1/k}
$$

- $\Gamma$: función gamma.
:::

:::formula[Construcción desde una exponencial]
$$
X = \lambda E^{1/k}, \qquad E \sim \operatorname{Exp}(1)
$$

- $E$: exponencial de tasa 1.
:::
